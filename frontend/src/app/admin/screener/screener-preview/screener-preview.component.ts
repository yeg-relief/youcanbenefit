import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { FormGroup } from '@angular/forms';
import * as fromRoot from '../../reducer';
import { Question, Question_2 } from '../../models';
import { QuestionControlService } from '../../../user/master-screener/questions/question-control.service';
import { Observable, ReplaySubject } from 'rxjs';
import { take, tap, map, mergeMap, reduce } from 'rxjs/operators'

@Component({
  selector: 'app-screener-preview',
  templateUrl: './screener-preview.component.html',
  styleUrls: ['./screener-preview.component.css'],
  providers: [ QuestionControlService ]
})
export class ScreenerPreviewComponent implements OnInit {
  form = new ReplaySubject<FormGroup>(1);
  questions: Question[] = [];
  conditionalQuestions: Question[] = [];

  constructor(
    private store: Store<fromRoot.State>,
    private questionControlService: QuestionControlService,
  ) { }

  ngOnInit() {
    this.store.pipe(fromRoot.getForm,take(1)).subscribe( (form: FormGroup) => this.form.next(form));

    this.store
      .pipe(
        fromRoot.getForm,
        take(1),
        this.partitionQuestions.bind(this),
        this.flattenKeys,
      )
      .subscribe( partitionedQuestions => {
        this.questions = partitionedQuestions['questions'];
        this.conditionalQuestions = partitionedQuestions['conditionalQuestions'];
        this.form.next( this.questionControlService.toFormGroup(this.questions) );
      });
  }

  private partitionQuestions(form: Observable<FormGroup>) {
    let formValues = {};
    return form
      .pipe(
        map(form => form.value),
        tap(values => formValues = values),
        map(values => Object.keys(values)),
        mergeMap(x => x),
        reduce( (accum: any, value: any) => { 
          if (this.isConditional(formValues, value)) {
            accum.conditionalQuestions = [...accum.conditionalQuestions, formValues[value]];
          } else {
            accum.questions = [...accum.questions, formValues[value]];
          } 
          return accum;
        }, {conditionalQuestions: [], questions: []})
      )
  }

  private isConditional(questionValues, questionID){
    for (const key in questionValues) {
      const q: Question_2 = questionValues[key];
      if (Array.isArray(q.conditionalQuestions) && q.conditionalQuestions.find(cq_id => cq_id === questionID) !== undefined) {
        return true;
      }
    }
    return false;
  }

  private flattenKeys(input: Observable<{[key: string]: Question_2[]}>): Observable<{[key: string]: Question[] }> {
    const removeKeyType = (question: Question_2): Question => {
      const keyName = question.key.name;
      return (<any>Object).assign({}, question, {key: keyName});
    }


    return input.pipe(map( screener => {
      return {
        questions: screener['questions'].map(removeKeyType),
        conditionalQuestions: screener['conditionalQuestions'].map(removeKeyType),
      }
    }))
  }

  gatherConditionals(question) {
    if (!question.expandable || !Array.isArray(question.conditionalQuestions) || question.conditionalQuestions.length === 0){
      return [];
    }
    const conditionals = question.conditionalQuestions;
    return this.conditionalQuestions.filter( q => conditionals.find(id => id === q.id))
  }


  addControls($event) {
    let form;
    this.form.pipe(take(1)).subscribe(f => form = f);
    const conditionalQuestions = this.conditionalQuestions.filter( q => $event.find(id => q.id === id) );
    this.questionControlService.addQuestions(conditionalQuestions, form);
    this.form.next( form );
  }

  removeControls($event) {
    let form;
    this.form.pipe(take(1)).subscribe(f => form = f);
    const conditionalQuestions = this.conditionalQuestions.filter( q => $event.find(id => q.id === id) ).sort( (a, b) => a.index - b.index);
    this.questionControlService.removeQuestions(conditionalQuestions, form);
    this.form.next( form );
  }
}

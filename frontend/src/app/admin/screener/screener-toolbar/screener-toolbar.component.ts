import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Http, } from '@angular/http';
import { Store } from '@ngrx/store';
import { Question } from '../../models';
import { AuthService } from '../../core/services/auth.service';
import * as fromRoot from '../../reducer';
import { select } from '@ngrx/store'
import { Observable, pipe, combineLatest } from 'rxjs';
import {
  map,
  filter, 
  take,
  pluck
} from 'rxjs/operators'
import { environment } from '../../../../environments/environment'

@Component({
  selector: 'app-screener-toolbar',
  templateUrl: './screener-toolbar.component.html',
  styleUrls: ['./screener-toolbar.component.css'],
})
export class ScreenerToolbarComponent implements OnInit {
  count$: Observable<number>;
  form$: Observable<any>;
  created$: Observable<any>;
  disabled = false;
  errors: any =  { error: '' };

  constructor(
    private store: Store<fromRoot.State>,
    private auth: AuthService,
    private http: Http
  ) {}

  ngOnInit() {
    this.form$ = this.store.pipe(select('root'), select('screener'))
  }

  isConditional(id: string, questions: any[]): boolean {
    const conditionals = questions.reduce( (accum, question) => ([...accum, ...question['conditionalQuestions']]), [])
    return conditionals.some(q => q === id)
  }

  toArray(screener) {
    return Object.keys(screener).map(id => screener[id])
  }

  handleSave() {
    const partitionQuestions = pipe(
      map(form => {
        const screener = form['value']
        const array = this.toArray(screener)
        return {
          conditionalQuestions: array.filter(question => this.isConditional(question.id, array)),
          questions: array.filter(question => !this.isConditional(question.id, array))
        }
      })
    )

    const questions = this.form$.pipe(
      pluck('form'),
      filter(form => form['valid']),
      partitionQuestions
    )
    
    const questionKeys = this.form$.pipe(
      map(screener => {
        const questionData = screener['form'].value
        return this.getQuestionKeys(questionData)
      })
    )

    combineLatest(
      questions,
      questionKeys,
      (questions, questionKeys) => ({...questions, questionKeys})
    ).pipe(take(1))
      .subscribe(screener => {
        return this.http.post(`${environment.api}/protected/screener`, screener, this.auth.getCredentials()).toPromise().then(console.log).catch(console.error)
      })
  }

  private getQuestionKeys(questionData) : any[] {
    const questionDataArray = this.toArray(questionData)
    const questionKeyArray = [];
    questionDataArray.forEach(q => {
      let questionKeyType;
      if (q.controlType === "Multiselect") {
        q.multiSelectOptions.forEach(multiQuestion => {
          questionKeyArray.push({text: multiQuestion.text, id: 'multiID', type: "boolean"})
        });
      } else if (q.controlType === "NumberInput") {
        questionKeyType = "integer";
      } else if (q.controlType === "Toggle") {
        questionKeyType = "boolean";
      }
      if (questionKeyType) {
        questionKeyArray.push({text: q.label, id: q.id, type: questionKeyType})
      }
    })
    return questionKeyArray
  }

  handleUpdateKeys() {
    this.form$.pipe(
      map( screener => {
        const questionData = screener['form'].value
        return this.getQuestionKeys(questionData)
      })
    ).pipe(take(1))
      .subscribe(array => {
        console.log(array)
        return this.http.post(`${environment.api}/protected/updatekeys`, array, this.auth.getCredentials()).toPromise().then(console.log).catch(console.error)
      })
  }

}

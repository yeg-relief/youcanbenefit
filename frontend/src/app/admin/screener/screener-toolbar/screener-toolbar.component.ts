import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Store } from '@ngrx/store';
import { Key, Question, Question_2 } from '../../models';
import { AuthService } from '../../core/services/auth.service';
import * as fromRoot from '../../reducer';
import * as actions  from '../store/screener-actions';
import { select } from '@ngrx/store'
import { Observable, ReplaySubject } from 'rxjs';
import {
  map,
  withLatestFrom,
  tap,
  startWith,
  multicast,
  refCount,
  filter, 
  take,
  mergeMap,
  reduce,
} from 'rxjs/operators'
import { KeyFilterService } from '../services/key-filter.service';

@Component({
  selector: 'app-screener-toolbar',
  templateUrl: './screener-toolbar.component.html',
  styleUrls: ['./screener-toolbar.component.css'],
})
export class ScreenerToolbarComponent implements OnInit {
  count$: Observable<number>;
  adminControls: FormGroup;
  allKeys$: Observable<Key[]>;
  form$: Observable<any>;
  created$: Observable<any>;
  disabled = false;
  errors: any =  { error: '' };

  constructor(
    private store: Store<fromRoot.State>, 
    private keyFilter: KeyFilterService, 
    private auth: AuthService
  ) {}

  ngOnInit() {
    this.form$ = this.store.pipe(select('root'), select('screener'), tap(console.dir))
    const group = { keyFilter: new FormControl('') };
    this.adminControls = new FormGroup(group);

    this.allKeys$ = 
      this.adminControls.get('keyFilter').valueChanges
        .pipe(
          map( (filterItem) => filterItem.name !== undefined ? filterItem.name : filterItem ),
          withLatestFrom(this.store.pipe(select('root'), select('screener'), select('keys'))),
          map( ([filterInput, _, ]) => [_, new RegExp(<string>filterInput, 'gi')]),
          map( ([keys, filterRegex]) => (<Key[]>keys).filter(key => (<RegExp>filterRegex).test(key.name)) ),
          tap ( keys => this.keyFilter.setValue(keys.map(k => k.name))),
          startWith(this.adminControls.get('keyFilter').value)
        )
  }

  displayFunction(key: Key){
    return key ? key.name : key;
  }

  handleSave() {
    this.form$
      .pipe(
        filter(form => form.valid),
        take(1),
        this.partitionQuestions.bind(this),
        this.flattenKeys.bind(this)
      )
        .subscribe( (questions) => {
          const screener = (<any>Object).assign({}, questions, { created: -1 });
          this.store.dispatch(new actions.SaveData({screener, credentials: this.auth.getCredentials()}));
        })
  }

  private partitionQuestions(form: Observable<FormGroup>): Observable<{[key: string]: Question[]}> {
    let formValues = {};
    return form.pipe(
      map(form => form.value),
      tap(values => formValues = values),
      map(values => Object.keys(values)),
      mergeMap( x => x),
      reduce( (accum: any, value) => {
        if (this.isConditional(formValues, value)) 
          accum.conditionalQuestions = [...accum.conditionalQuestions, formValues[value]];
        else 
          accum.questions = [...accum.questions, formValues[value]];

        return accum;
      }, {conditionalQuestions: [], questions: []})
    )
  }

  private flattenKeys(input: Observable<{[key: string]: Question_2[]}>): Observable<{[key: string]: Question[] | number}> {
    const removeKeyType = (question: Question_2): Question => {
      const keyName = question.key.name;
      delete question['key'];
      return (<any>Object).assign({}, question, {key: keyName});
    };


    return input.pipe(map( screener => {
      return {
        questions: screener['questions'].map(removeKeyType),
        conditionalQuestions: screener['conditionalQuestions'].map(removeKeyType),
        created: -1
      }
    }))
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
}

import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Http, } from '@angular/http';
import { Store } from '@ngrx/store';
import { Key, Question, Question_2 } from '../../models';
import { AuthService } from '../../core/services/auth.service';
import * as fromRoot from '../../reducer';
import { select } from '@ngrx/store'
import { Observable, pipe, combineLatest } from 'rxjs';
import {
  map,
  withLatestFrom,
  tap,
  startWith,
  filter, 
  take,
  pluck
} from 'rxjs/operators'
import { KeyFilterService } from '../services/key-filter.service';
import { environment } from '../../../../environments/environment'
import { DataService } from '../../data.service';
import * as keysActions from '../../keys/actions';

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
    private auth: AuthService,
    private http: Http,
    private dataService: DataService,
  ) {}

  ngOnInit() {
    this.form$ = this.store.pipe(select('root'), select('screener'))
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
      partitionQuestions,
      map(this.removeKeyType),
    )

    const unusedKeys = this.form$.pipe(
      map(screener => {
        const questionData = screener['form'].value
        console.log(questionData)
        const extractKeys = id => {
          const question = questionData[id]
          return question.controlType === "Multiselect" ? question.multiSelectOptions.map(q => q.key) : [question.key]
        }

        const keys = Object.keys(questionData).map(extractKeys).reduce((accum, keys) => [...keys, ...accum], [])
        const unusedKeys = screener['keys'].filter(key => keys.every(screenerKey => screenerKey.name !== key.name))
        return unusedKeys
      })
    )
    
    const keys = this.form$.pipe(
      map(screener => {
        const questionData = screener['form'].value
        console.log(questionData)
        const extractKeys = id => {
          const question = questionData[id]
          return question.controlType === "Multiselect" ? question.multiSelectOptions.map(q => q.key) : [question.key]
        }
        const keys = Object.keys(questionData).map(extractKeys).reduce((accum, keys) => [...keys, ...accum], [])
        const unusedKeys = screener['keys'].filter(key => keys.some(screenerKey => screenerKey.name === key.name))
        return unusedKeys
      })
    )

    combineLatest(
      questions,
      keys,
      unusedKeys,
      (questions, keys, unusedKeys) => ({...questions, keys, unusedKeys})
    ).pipe(take(1))
      .subscribe(screener => {
        return this.http.post(`${environment.api}/protected/screener`, screener, this.auth.getCredentials()).toPromise().then(console.log).catch(console.error)
      })
  }

  handleUpdateKeys() {
    this.form$.pipe(
      map( screener => {
        const questionData = screener['form'].value
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
      })
    ).pipe(take(1))
      .subscribe(array => {
        console.log(array)
        return this.http.post(`${environment.api}/protected/updatekeys`, array, this.auth.getCredentials()).toPromise().then(console.log).catch(console.error)
      })
  }

  private removeKeyType(screener: {[key: string]: Question_2[]}) {
    const _removeKeyType = (question: Question_2): Question => {
      const keyName = question.label;
      return (<any>Object).assign({}, question, {key: keyName});
    };

    return {
      questions: screener['questions'].map(_removeKeyType),
      conditionalQuestions: screener['conditionalQuestions'].map(_removeKeyType),
      created: -1
    }
  }

}

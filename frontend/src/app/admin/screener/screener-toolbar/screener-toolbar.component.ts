import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Http, } from '@angular/http';
import { Store } from '@ngrx/store';
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
import { environment } from '../../../../environments/environment';
import { MatSnackBar } from '@angular/material';

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
    private http: Http,
    public snackBar: MatSnackBar
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
          screenerQuestions: array.filter(question => !this.isConditional(question.id, array))
        }
      })
    )

    const screenerQuestions = this.form$.pipe(
      pluck('form'),
      filter(form => form['valid']),
      partitionQuestions
    )
    
    const questions = this.form$.pipe(
      map(screener => {
        const questionData = screener['form'].value
        return this.getQuestions(questionData)
      })
    )

    combineLatest(
      screenerQuestions,
      questions,
      (screenerQuestions, questions) => ({...screenerQuestions, questions})
    ).pipe(take(1))
      .subscribe(screener => {
        return this.http.post(`${environment.api}/protected/screener/`, screener, this.auth.getCredentials())
                .subscribe(res => {
                  if (res.status === 201) {
                    res = res.json();
                    if ((res['screener']['result'] === 'created' || res['screener']['result'] === 'updated') &&
                          res['questions']['acknowledged'] === true) {
                      this.snackBar.open("screener saved", '', { duration: 2000})
                      return
                    }
                  }
                  this.snackBar.open("screener failed to save", '', { duration: 2000})
                })
      })
  }

  getQuestions(questionData) : any[] {
    const questionDataArray = this.toArray(questionData)
    const questionArray = [];
    questionDataArray.forEach(q => {
      let questionType;
      if (q.controlType === "Multiselect") {
        q.multiSelectOptions.forEach(multiQuestion => {
          questionArray.push({text: multiQuestion.text, id: multiQuestion.id, type: "boolean"})
        });
      } else if (q.controlType === "NumberInput") {
        questionType = "integer";
      } else if (q.controlType === "Toggle") {
        questionType = "boolean";
      }
      if (questionType) {
        questionArray.push({text: q.label, id: q.id, type: questionType})
      }
    })
    return questionArray
  }

}

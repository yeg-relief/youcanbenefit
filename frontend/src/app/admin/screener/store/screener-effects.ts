import { Injectable } from '@angular/core';
import { Http, } from '@angular/http';
import { Actions, Effect } from '@ngrx/effects';
import { ScreenerActionTypes } from './screener-actions';
import { environment } from '../../../../environments/environment'
import { of } from 'rxjs';
import { filter, map, switchMap, tap, retry, timeout, catchError } from 'rxjs/operators'

const TIMEOUT = 20000;
const URL = `${environment.api}/protected/screener`;

@Injectable()
export class ScreenerEffects {
  constructor(
    private http: Http,
    private actions$: Actions,
  ) { }

  @Effect() loadData$ = this.actions$
      .pipe(
        filter(action => action.type === ScreenerActionTypes.LOAD_DATA),
        map( (action: any) => action.payload),
        switchMap(requestOptions => {
          return this.http.get(URL, requestOptions)
              .pipe(
                map(res => ({ type: ScreenerActionTypes.LOAD_DATA_SUCCESS, payload: res.json() })),
                retry(2),
                timeout(TIMEOUT),
                catchError(() => of({ type: ScreenerActionTypes.LOAD_DATA_FAILURE }))
              )
        })
      )

  @Effect() saveData$ = this.actions$
      .pipe(
        filter(action => action.type === ScreenerActionTypes.SAVE_DATA),
        map((action: any) => [action.payload.screener, action.payload.credentials]),
        switchMap( ([payload, options]) => {
          return this.http.post(URL, payload, options)
        })
      )
      
}
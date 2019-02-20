import { Observable } from 'rxjs';
import { combineReducers, select } from '@ngrx/store';
import * as fromScreener from './screener/store/screener-reducer';
import { createSelector } from 'reselect';

export interface State {
  screener: fromScreener.State;
}

const reducers = {
  screener: fromScreener.reducer
};

const productionReducer = combineReducers(reducers);


export function reducer(state: any, action: any) {
  return productionReducer(state, action);
}

export function getScreenerState(state$: Observable<State>) {
  return state$.pipe(select('screener'));
}

export function getKeyOverview(state$: Observable<State>) {
  return state$.pipe(select('keyOverview'));
}


/* for screener */
export const getForm = fromScreener.getForm

export const getScreenerError = fromScreener.getError

export const isScreenerLoading = fromScreener.isLoading

export const getConstantQuestions = createSelector(getScreenerState, fromScreener.getConstantQuestions, );

export const getSelectedConstantID = fromScreener.getSelectedConstantID

export const getSelectedConditionalID = fromScreener.getSelectedConditionalID
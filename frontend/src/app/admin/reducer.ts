import { Observable } from 'rxjs/Observable';
import { combineReducers } from '@ngrx/store';
import * as fromKeyOverview from './keys/reducer';
import * as fromScreener from './screener/store/screener-reducer';
import { createSelector } from 'reselect';

export interface State {
  keyOverview: fromKeyOverview.State;
  screener: fromScreener.State;
}

const reducers = {
  keyOverview: fromKeyOverview.reducer,
  screener: fromScreener.reducer
};

const productionReducer = combineReducers(reducers);


export function reducer(state: any, action: any) {
  return productionReducer(state, action);
}

export function getScreenerState(state$: Observable<State>) {
  return state$.select(state => state.screener);
}

export function getKeyOverview(state$: Observable<State>) {
  return state$.select(state => state.keyOverview);
}


/* for screener */
export const getForm = createSelector(getScreenerState, fromScreener.getForm, );

export const getScreenerError = createSelector(getScreenerState, fromScreener.getError, );

export const isScreenerLoading = createSelector(getScreenerState, fromScreener.isLoading, );

export const getConstantQuestions = createSelector(getScreenerState, fromScreener.getConstantQuestions, );

export const getSelectedConstantID = createSelector( getScreenerState, fromScreener.getSelectedConstantID);

export const getSelectedConditionalID = createSelector( getScreenerState, fromScreener.getSelectedConditionalID,);

export const getScreenerKeys = createSelector(getScreenerState, fromScreener.getKeys);

export const getUnusedScreenerKeys = createSelector( getScreenerState, fromScreener.getUnusedKeys,);


/* for keys **key/overview etc** */
export const allLoadedKeys = createSelector(getKeyOverview, fromKeyOverview.getLoadedKeys);


import { Action } from '@ngrx/store';
import { Question, QuestionType, ID, Screener } from '../../models';
import { RequestOptions } from '@angular/http';

export const ScreenerActionTypes = {
  ADD_QUESTION: '[SCREENER] ADD_QUESTION',
  ADD_CONDITIONAL_QUESTION: '[SCREENER] ADD_CONDITIONAL_QUESTION',
  DELETE_QUESTION: '[SCREENER] DELETE_QUESTION',
  DROP_QUESTION: '[SCREENER] DROP_QUESTION',
  LOAD_DATA: '[SCREENER] LOAD_DATA',
  LOAD_DATA_FAILURE: '[SCREENER] LOAD_DATA_FAILURE',
  LOAD_DATA_SUCCESS: '[SCREENER] LOAD_DATA_SUCCESS',
  SAVE_DATA: '[SCREENER] SAVE_DATA',
  SAVE_DATA_FAILURE: '[SCREENER] LOAD_DATA_FAILURE',
  SAVE_DATA_SUCCESS: '[SCREENER] LOAD_DATA_SUCCESS',
  SELECT_QUESTION: '[SCREENER] SELECT_QUESTION',
  SELECT_CONDITIONAL_QUESTION: '[SCREENER] SELECT_CONDITIONAL_QUESTION',
  SWAP_QUESTIONS: '[SCREENER] SWAP_QUESTIONS',
  UNSELECT_QUESTION: '[SCREENER] UNSELECT_QUESTION',

};


export class AddQuestion implements Action {
  type = ScreenerActionTypes.ADD_QUESTION;
  constructor(public payload: {}) {}
}

export class AddConditionalQuestion implements Action {
  type = ScreenerActionTypes.ADD_CONDITIONAL_QUESTION;
  constructor(public payload: ID) {}
}

export class DeleteQuestion implements Action {
  type = ScreenerActionTypes.DELETE_QUESTION;
  constructor(public payload: ID) {}
}

export class DropQuestion implements Action {
  type = ScreenerActionTypes.DROP_QUESTION;
  constructor(public payload: {[key: string]: string}) {}
}

export class LoadData implements Action {
  type = ScreenerActionTypes.LOAD_DATA;

  constructor(public payload: RequestOptions) { }
}

export class LoadDataFailure implements Action {
  type = ScreenerActionTypes.LOAD_DATA_FAILURE;
  constructor(public payload: {}) {}
}

export class LoadDataSuccess implements Action {
  type = ScreenerActionTypes.LOAD_DATA_SUCCESS;
  constructor(public payload: Screener) {}
}

export class SaveData implements Action {
  type = ScreenerActionTypes.SAVE_DATA;

  constructor(public payload: { [key: string]: Screener | RequestOptions }) { }
}

export class SaveDataFailure implements Action {
  type = ScreenerActionTypes.SAVE_DATA_FAILURE;
  constructor(public payload: string) {}
}

export class SaveDataSuccess implements Action {
  type = ScreenerActionTypes.SAVE_DATA_SUCCESS;
  constructor(public payload: Screener) {}
}

export class SelectQuestion implements Action {
  type = ScreenerActionTypes.SELECT_QUESTION;
  constructor(public payload: ID) {}
}

export class SelectConditionalQuestion implements Action {
  type = ScreenerActionTypes.SELECT_CONDITIONAL_QUESTION;
  constructor(public payload: ID) {}
}

export class SwapQuestions implements Action {
  type = ScreenerActionTypes.SWAP_QUESTIONS;
  constructor(public payload: { [key: string]: ID }) {}
}

export class UnselectQuestion implements Action {
  type = ScreenerActionTypes.UNSELECT_QUESTION;
  constructor(public payload: ID) {}
}


export type ScreenerActions = 
  AddQuestion               |
  AddConditionalQuestion    |
  DeleteQuestion            |
  DropQuestion              |
  LoadData                  |
  LoadDataFailure           |
  LoadDataSuccess           |
  SaveData                  |
  SaveDataFailure           |
  SaveDataSuccess           |
  SelectQuestion            |
  SelectConditionalQuestion |
  SwapQuestions             |
  UnselectQuestion          ;

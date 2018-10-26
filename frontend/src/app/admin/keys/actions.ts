import { Action } from '@ngrx/store';
import { Key } from '../models/key';

export const KeysActionsTypes = {
  LOAD_KEYS: '[KEYS] LOAD_KEYS',
  LOAD_KEYS_SUCESS: '[KEYS] LOAD_KEYS_SUCESS',
  LOAD_KEYS_FAILURE: '[KEYS] LOAD_KEYS_FAILURE',
  UPDATE_KEY: '[KEYS] UPDATE_KEY',
  DELETE_KEY: '[KEYS] DELETE_KEY'
};

export class _LoadKeys implements Action {
  type = KeysActionsTypes.LOAD_KEYS;

  constructor(public payload: {}) { }
}

export class _LoadKeysSuccess implements Action {
  type = KeysActionsTypes.LOAD_KEYS_SUCESS;

  constructor(public payload: Key[]) { }
}

export class _LoadKeysFailure implements Action {
  type = KeysActionsTypes.LOAD_KEYS_FAILURE;

  constructor(public payload: {}) { }
}

export class _UpdateKey implements Action {
  type = KeysActionsTypes.UPDATE_KEY;

  constructor(public payload: [Key]) { }
}

export class _DeleteKey implements Action {
  type = KeysActionsTypes.DELETE_KEY;
  constructor(public payload: Key) { }
}

export type KeysActions =
    _LoadKeys
  | _LoadKeysSuccess
  | _LoadKeysFailure
  | _UpdateKey
  | _DeleteKey;

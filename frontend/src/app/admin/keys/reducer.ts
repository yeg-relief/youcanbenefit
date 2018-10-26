import '@ngrx/core/add/operator/select';
import { Key } from '../models/key';
import { KeysActions, KeysActionsTypes } from './actions';
import { Observable } from 'rxjs/Observable';

export interface State {
  loading: boolean;
  keys: Key[];
}

export const initialState: State = {
  loading: false,
  keys: []
};

export function reducer(state = initialState, action: KeysActions): State {
  switch (action.type) {
    case KeysActionsTypes.LOAD_KEYS: {
      return Object.assign({}, state, {
        loading: true
      });
    }
    case KeysActionsTypes.LOAD_KEYS_SUCESS: {
      return Object.assign({}, state, {
        loading: false,
        keys: [...<Key[]>action.payload]
      });
    }
    case KeysActionsTypes.LOAD_KEYS_FAILURE: {
      return Object.assign({}, state, {
        loading: false,
        keys: []
      });
    }
    case KeysActionsTypes.UPDATE_KEY: {
      const newKey = <Key>action.payload[0];
      const newKeys = state.keys.filter( (key: Key) => key.name !== newKey.name);
      return Object.assign({}, state, {
        keys: [newKey, ...newKeys]
      });
    }
    case KeysActionsTypes.DELETE_KEY: {
      const deleteKey = <Key>action.payload;
      const newKeys = state.keys.filter( (key: Key) => key.name !== deleteKey.name);
      return Object.assign({}, state, {
        keys: [...newKeys]
      });
    }
    default: {
      return state;
    }
  }
}

export function getLoadedKeys(state$: Observable<State>) {
  return state$.filter(s => !s.loading).select(s => s.keys);
}

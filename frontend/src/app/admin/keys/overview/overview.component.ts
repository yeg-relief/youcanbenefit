import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Key } from '../../models/key';
import * as keysActions from '../actions';
import * as fromRoot from '../../reducer';
import { Observable , merge, BehaviorSubject, of } from 'rxjs';
import { scan, switchMap } from 'rxjs/operators'
import { DataService } from '../../data.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-keys-overview',
  templateUrl: './overview.component.html',
  styleUrls: ['./overview.component.css']
})
export class KeysOverviewComponent implements OnInit {
  loadedKeys$: Observable<Key[]>;
  private filter = new BehaviorSubject<string>('');
  constructor(private store: Store<fromRoot.State>, private data: DataService, private route: ActivatedRoute) { }

  ngOnInit() {
    const keys = this.route.snapshot.data['keys'];
    this.store.dispatch(new keysActions._LoadKeys({}));
    if (keys !== undefined) {
      this.store.dispatch(new keysActions._LoadKeysSuccess(keys));
    } else {
      this.store.dispatch(new keysActions._LoadKeysFailure({}));
    }

    this.loadedKeys$ = merge(
      this.store.pipe(fromRoot.allLoadedKeys),
      this.filter
    ).pipe(
      scan( (state: KeyFilterState, update: string | Key[]) => {
        if (Array.isArray(update)) {
          state.keys = [...update];
        } else if ( typeof update === 'string') {
          state.keyName = update;
        }

        return state;
      }, new KeyFilterState([], '')),
      applyFilter
    );
  }

  handleFilter(keyName: string) {
    this.filter.next(keyName);
  }
}

class KeyFilterState {
  keys: Key[];
  keyName: string;

  constructor(keys, keyName) {
    this.keys = keys;
    this.keyName = keyName;
  }
}

function applyFilter(source: Observable<KeyFilterState>): Observable<Key[]> {
  return source
    .pipe(switchMap( (state: KeyFilterState) => {
      const regexp = new RegExp(state.keyName.toLowerCase().trim());
      return of(state.keys.filter(k => regexp.test(k.name.toLowerCase().trim())))
    }))
}
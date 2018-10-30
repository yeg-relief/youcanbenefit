import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Key } from '../../models/key';
import * as keysActions from '../actions';
import * as fromRoot from '../../reducer';
import { Observable } from 'rxjs/Observable';
import { DataService } from '../../data.service';
import { ActivatedRoute } from '@angular/router';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/operator/scan';
import 'rxjs/add/operator/let';
import 'rxjs/add/observable/merge';


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

    this.loadedKeys$ = Observable.merge(
      this.store.let(fromRoot.allLoadedKeys),
      this.filter
    )
      .scan( (state: KeyFilterState, update: string | Key[]) => {
        if (Array.isArray(update)) {
          state.keys = [...update];
        } else if ( typeof update === 'string') {
          state.keyName = update;
        }

        return state;
      }, new KeyFilterState([], ''))
      .let(applyFilter)
      
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
  return source.switchMap( (state: KeyFilterState) => {
    const regexp = new RegExp(state.keyName.toLowerCase().trim());
    return Observable.of(state.keys.filter(k => regexp.test(k.name.toLowerCase().trim())))
  })
}
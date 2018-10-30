import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormControl, Validators, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { Key } from '../../models/key';
import { Store } from '@ngrx/store';
import * as keysActions from '../actions';
import * as fromRoot from '../../reducer';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/withLatestFrom';
import 'rxjs/add/operator/takeUntil';
import 'rxjs/add/operator/take';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/delay';
import { Subject } from 'rxjs/Subject';
import { DataService } from '../../data.service';

/*
 for now we will only focus on making new keys and not editing existing keys. 
 ie, we *edit* a new empty key.
*/
@Component({
  selector: 'app-key-edit',
  templateUrl: './key-edit.component.html',
  styleUrls: ['./key-edit.component.css']
})
export class KeyEditComponent implements OnInit, OnDestroy {
  keys$: Observable<Key[]>;
  destroy$ = new Subject();
  typeOptions = [
    'number',
    'boolean'
  ];
  uniqueKeyName = false;

  nameControl = new FormControl(
    '',
    Validators.compose(
      [
        Validators.required,
        Validators.pattern('[a-z]+_?[a-z]+?')
      ]
    )
  );
  typeControl = new FormControl(this.typeOptions[0]);
  form = new FormGroup({
    name: this.nameControl,
    type: this.typeControl
  });
  saving = false;

  constructor(
    private store: Store<fromRoot.State>,
    private data: DataService,
    private router: Router
  ) { }

  ngOnInit() {
    this.keys$ = this.store.let(fromRoot.allLoadedKeys).takeUntil(this.destroy$.asObservable());
    const form$ = this.form.valueChanges;

    form$
      .withLatestFrom(this.keys$)
      .map( ([form, keys]) => keys.filter(programKey => programKey.name === form.name))
      // if array is empty then there are no duplicates => return true
      .map(duplicateKeys => duplicateKeys.length === 0)
      .takeUntil(this.destroy$.asObservable())
      .subscribe(
        (noDuplicate) => this.uniqueKeyName = noDuplicate,
        (err) => console.log(err),
      );
  }

  ngOnDestroy() {
    this.destroy$.next();
  }

  dispatchKeyUpdate() {
    const key: Key = {
      name: this.form.value.name,
      type: this.form.value.type
    };
    this.data.updateKey(key)
      .take(1)
      .do(() => this.store.dispatch(new keysActions._UpdateKey([key])))
      .do(() => this.saving = true)
      .delay(500)
      .subscribe({
        complete: () => this.router.navigateByUrl('/admin/keys/overview')
      })
    
  }

  handleCancel() {
    this.router.navigateByUrl('/admin/keys/overview')
  }
}


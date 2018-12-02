import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormControl, Validators, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { Key } from '../../models/key';
import { Store, select } from '@ngrx/store';
import * as keysActions from '../actions';
import * as fromRoot from '../../reducer';
import { Observable ,  Subject } from 'rxjs';
import { DataService } from '../../data.service';
import { takeUntil, withLatestFrom, map, tap, take, delay } from 'rxjs/operators'

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
    this.keys$ = this.store.pipe(
      fromRoot.getKeyOverview, 
      takeUntil(this.destroy$.asObservable())
    );

    this.form.valueChanges
      .pipe(
        withLatestFrom(this.keys$),
        // if array is empty then there are no duplicates => return true
        map( ([form, keys]) => keys.filter(programKey => programKey.name === form.name).length === 0),
        takeUntil(this.destroy$.asObservable())
      )
      .subscribe(
        noDuplicate => this.uniqueKeyName = noDuplicate,
        console.error,
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
      .pipe(
        take(1),
        tap(() => {
          this.store.dispatch(new keysActions._UpdateKey([key]))
          this.saving = true
        }),
        delay(500)
      )
      .subscribe(() => this.router.navigateByUrl('/admin/keys/overview'));
  }

  handleCancel() {
    this.router.navigateByUrl('/admin/keys/overview')
  }
}


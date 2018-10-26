import { Injectable } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { Observable } from 'rxjs/Observable';
import { ReplaySubject } from 'rxjs/ReplaySubject';
import 'rxjs/add/operator/multicast';

@Injectable()
export class KeyFilterService {
  private filter: FormGroup;
  filteredKey$: Observable<string[]>;

  constructor() {
    this.filter = new FormGroup({keyNames: new FormControl([])});

    this.filteredKey$ = this.filter.valueChanges
                            .startWith(this.filter.get('keyNames').value)
                            .multicast( new ReplaySubject(1)).refCount();

    this.filteredKey$.subscribe();
  }

  setValue(keyNames: string[]) {
    if (keyNames !== undefined && Array.isArray(keyNames))
      this.filter.get('keyNames').setValue(keyNames);
  }
}

import { Injectable } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms'
import { ID } from '../../models';
import { Observable } from 'rxjs/Observable';
import { ReplaySubject } from 'rxjs/ReplaySubject';


export interface DragDatum {
  lifted: ID;
  target: ID;
}

const LIFTED: 'lifted' = 'lifted';
const TARGET: 'target' = 'target';

@Injectable()
export class DragDropManagerService {
  private state: FormGroup;
  public dragState: Observable<DragDatum>;

  constructor(private fb: FormBuilder) {
    this.state = this.fb.group({
      lifted: ['', Validators.required],
      target: ['', Validators.required]
    });

    this.dragState = this.state.valueChanges
      .startWith(this.state.value)
      .filter( _ => this.state.valid)
      .multicast( new ReplaySubject(1) ).refCount();

    this.dragState.subscribe();
  }

  liftItem(id: ID) { 
    const target = this.state.get(TARGET).value;
    if( id !== undefined && id !== '' && target === '') 
      this.state.setValue({ lifted: id, target: '' });
    else
      this.state.setValue({lifted: '', target: ''}); 
  }

  dropItem(targetID: ID) { 
    const lifted = this.state.get(LIFTED).value;
    if (targetID !== undefined && targetID !== '' && lifted !== '') 
      this.state.get(TARGET).setValue(targetID); 
    else
      this.state.setValue({lifted: '', target: ''}); 
  }

}

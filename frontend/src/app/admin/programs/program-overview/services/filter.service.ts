import { Injectable } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';


@Injectable()
export class FilterService {
  public form: FormGroup;




  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      value: [''],
      type: ['none', Validators.required]
    });
    this.form.get('value').disable();
  }

  effectInput(shouldEnable: boolean) {
    const valueControl = this.form.get('value');

    if (shouldEnable) 
      valueControl.enable();
    else 
      valueControl.disable();
    
  }

}

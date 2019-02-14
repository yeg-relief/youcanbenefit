import { ProgramCondition, Question } from '../../models'
import { FormGroup, FormBuilder, AbstractControl, Validators, FormControl, FormArray } from '@angular/forms';
import { distinctUntilChanged } from 'rxjs/operators'

export class ProgramConditionClass {
    data: ProgramCondition;
    form: FormGroup;
 
    constructor(fb: FormBuilder, opts?){
        this.data = opts ? opts : {
            question: {
                text: 'invalid',
                id: 'invalid',
                type: 'invalid'
            },
            value: 'invalid',
            type: 'invalid',
            qualifier: 'invalid'
        };
        this._initForm(fb);
        this.form.get('question.type')
          .valueChanges
          .pipe(distinctUntilChanged()).subscribe(this.patchQualifierValue)
    }

    patchQualifierValue =  questionType => {
      if(questionType === 'boolean') {
        this.form.get('qualifier').setValue('equal');
      }
    };

    private _initForm(fb: FormBuilder) {
      try {
        this.form = fb.group({
            question: fb.group({
                text: new FormControl(this.data.question.text, Validators.required),
                id: new FormControl(this.data.question.id, Validators.required),
                type: new FormControl(this.data.question.type, Validators.required)
            }),
            value: new FormControl(this.data.value, Validators.required),
            type: new FormControl(this.data.type),
            qualifier: new FormControl(this.data.qualifier)
        }, {validator: this.validator})
      } catch(e){
        console.warn("ProgramConditionClass#_initForm")
      }

    }

    validator(condition: AbstractControl): {[key: string]: any} {
        const value = condition.value;
        const question: Question = value.question;
        let others = Object.keys(value).filter(q => q !== 'question')
        const errors = {};
        if (question.text === 'invalid' || question.type === 'invalid') {
            errors['invalid_key'] = 'question is invalid';
            condition.get('question').setErrors(errors);
        }

        others = value.question.type === 'boolean' ? others.filter(o => o !== 'qualifier') : others;

        others.forEach(prop => {
            if(value[prop] === 'invalid')
                errors[prop] = 'invalid'
        });

        if (question.type === 'number' && Number.isNaN(Number.parseInt(value.value, 10))) {
            errors['invalid-number-value'] = `${value.value} is not a valid number`;
        }

        if (question.type === 'number' && value.qualifier === null) {
            errors['null-qualifier'] = `${value.value} has a null qualifier`;
        }

        if (Object.keys(errors).length > 0)
            return errors;

        return null;
    }
}

import { AbstractControl } from '@angular/forms';
import { ControlType } from '../../models';

export function questionValidator(control: AbstractControl): {[key: string]: any} {
   

    const label: string = control.get('label').value; 
    const controlType: ControlType = control.get('controlType').value;


    let options: number[] = [];
    let conditionals: string[] = [];
    let expandable: boolean = false;
    
    if (control.get('expandable') !== null) {
        expandable = control.get('expandable').value;
    }


    if (control.get('options') !== null){
        options = control.get('options').value;
    }

    if (control.get('conditionalQuestions') !== null) {
        conditionals = control.get('conditionalQuestions').value;
    }

    let errors = { };


    if(label.length === 0){
        errors = (<any>Object).assign({}, errors, {emptyLabel: 'This question does not have a label.' } ); 
    } 


    if(controlType === 'NumberSelect' && options.length === 0){
        errors = (<any>Object).assign({}, errors, {no_options: 'This question requires options.'} ); 
    } 

    const rawControlType = <string>controlType;
    if(rawControlType === 'invalid')
    {
        errors = (<any>Object).assign({}, errors, {unnassigned_controlType: 'You need to assign a control type.'} );
    }


    if(expandable && conditionals.length === 0) {
        errors = (<any>Object).assign({}, errors, {empty_expandable: 'An expandable question requires conditional questions'} );
    }

    if(!expandable && conditionals.length > 0) {
        errors = (<any>Object).assign({}, errors, {not_expandable_with_conditionals: 'Conditional questions need to be within an expandable question.'})
    }


    if (Object.keys(errors).length === 0) return null;

    return errors;

}
import { Component, OnInit, OnDestroy, EventEmitter, Output } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl, AbstractControl } from '@angular/forms';
import { ID, Key, ControlType } from '../../models';
import { Observable } from 'rxjs/Observable';
import { ReplaySubject } from 'rxjs/ReplaySubject';
import { Subject } from 'rxjs/Subject';
import { Store } from '@ngrx/store';
import * as fromRoot from '../../reducer';
import 'rxjs/add/operator/pairwise';
import 'rxjs/add/operator/combineLatest';
import 'rxjs/add/operator/throttleTime';
import { Animations } from '../../../shared/animations'

@Component({
    selector: 'app-question-edit',
    templateUrl: './question-edit.component.html',
    styleUrls: ['./question-edit.component.css'],
    animations: [
        Animations.fade,
        Animations.fadeinAndOut
    ]
})
export class QuestionEditComponent implements OnInit, OnDestroy {
    readonly CONTROL_TYPE_VALUES = [
        { value: 'NumberInput', display: 'type' },
        { value: 'NumberSelect', display: 'select' },
        { value: 'Toggle', display: 'toggle' },
        { value: 'Multiselect', display: 'multiselect'}
    ].sort( (a, b) => a.display.trim().localeCompare(b.display.trim()));

    selectedQuestionID$: Observable<ID>;
    form$: Observable<AbstractControl>;
    unusedKeys: Key[] = [];
    optionForm: FormGroup;
    fadeState = 'in';

    controlType: ControlType = '';
    options = [];
    multiQuestions = [];

    destroySubs$ = new Subject();
    @Output() delete = new EventEmitter<ID>();
    @Output() makeExpandable = new EventEmitter<ID>();

    constructor(private store: Store<fromRoot.State>, private fb: FormBuilder) { }

    ngOnInit() {

        // data sources
        this.selectedQuestionID$ = Observable.combineLatest(
            this.store.let(fromRoot.getSelectedConstantID),
            this.store.let(fromRoot.getSelectedConditionalID)
        )
            .map( ([constant, conditional]) => {
                if (constant === undefined) {
                    return 'unselect all the questions';
                }

                if (conditional === undefined && constant !== undefined) {
                    return constant;
                }

                if (conditional !== undefined && constant !== undefined) {
                    return conditional;
                }

            })
            .filter(id => id !== undefined)
            .multicast( new ReplaySubject(1)).refCount();

        this.form$ = this.selectedQuestionID$
            .withLatestFrom(this.store.let(fromRoot.getForm))
            .filter( ([questionID, form]) => form.get(questionID) !== null)
            .map( ([questionID, form]) => form.get(questionID))
            .startWith(this.fb.group({
                label: [''], key: [''], controlType: [''], expandable: [false], options: []
            }))
            .do( form => this.controlType = form.get('controlType').value)
            .do( form => {
                const val = form.value;

                if (val.controlType && val.controlType === 'Multiselect' && val.multiSelectOptions) {
                    this.multiQuestions = [...val.multiSelectOptions];
                }
            })
            .multicast( new ReplaySubject(1)).refCount();

        this.store.let(fromRoot.getUnusedScreenerKeys)
            .takeUntil(this.destroySubs$.asObservable())
            .subscribe( keys => this.unusedKeys = [...keys]);

        this.form$
            .takeUntil(this.destroySubs$.asObservable())
            .throttleTime(400)
            .do(_ => this.fadeState = 'out')
            .delay(300)
            .do(_ => this.fadeState = 'in')
            .subscribe();
        // local form(s)

        const digit_pattern = '^\\d+$';

        this.optionForm = this.fb.group({
            optionValue: ['', Validators.required ]
        });

        // effects
        this.form$
            .filter( form => form !== null)
            .map( form => form.get('key'))
            .filter( key => key !== null)
            .switchMap( key => key.valueChanges.startWith(key.value).pairwise() )
            .debounceTime(100)
            .takeUntil(this.destroySubs$.asObservable())
            .withLatestFrom(this.form$)
            .subscribe( ([[prevKey, currKey], form]) => {

                const type = this.unusedKeys.find(k => k.name === currKey.name) ?
                    this.unusedKeys.find(k => k.name === currKey.name).type : null;
                form.get(['key', 'type']).setValue(type);
                if ( (prevKey && currKey) && (prevKey.name && currKey.name) && prevKey.name.substr(0, 7) !== 'invalid'){
                    this.unusedKeys = this.unusedKeys.filter(k => k.name !== currKey.name)
                        .concat(prevKey)
                        .sort( (a, b) => a.name.localeCompare(b.name));
                } else if (currKey && currKey.name) {
                    this.unusedKeys = this.unusedKeys.filter(k => k.name !== currKey.name)
                        .sort( (a, b) => a.name.localeCompare(b.name));
                }

            });

        this.form$
            .filter(form => form !== null)
            .switchMap( form => form.get('controlType').valueChanges )
            .let(this.updateInternalControlType.bind(this))
            .withLatestFrom(this.form$)
            .let(this.updateOptions.bind(this))
            .let(this.updateMultiOptions.bind(this))
            .takeUntil(this.destroySubs$.asObservable())
            .subscribe();


    }


    addOption() {
        const optionVal = this.optionForm.get('optionValue').value;
        if (Number.parseInt(optionVal, 10).toString().length === optionVal.length) {
            this.options = [...this.options, Number.parseInt(optionVal, 10)];
        } else {
            this.options = [...this.options, optionVal];
        }

        this.form$.take(1)
            .subscribe((group: FormGroup) => {
                const optionControl = group.get('options');
                if (optionControl === null) group.addControl('options', new FormControl([]));
                group.get('options').setValue(this.options);
                this.optionForm.get('optionValue').setValue('');
            })


    }

    transformErrors(errorObj){
        const errors = errorObj.errors;
        return Object.keys(errors).map(key => errors[key]);
    }

    updateInternalControlType(controlType$: Observable<ControlType>): Observable<ControlType> {
        return controlType$
            .do( controlUpdate => this.controlType = controlUpdate)
            .do( () => {
                if(this.controlType !== 'NumberSelect'){
                    this.options = [];
                    this.optionForm.get('optionValue').setValue('');
                }

                if(this.controlType === 'Multiselect') {
                    this.multiQuestions = [];
                }
            })
    }

    updateOptions(input$: Observable<Array<ControlType | FormGroup>>): Observable<Array<ControlType | FormGroup>> {

        return input$.do( ([controlType, form]) => {
            const f = <FormGroup>form;
            const ct = <ControlType>controlType;

            if (f.get('options') === null) f.addControl('options', new FormControl([]));

            if (ct === 'NumberSelect' || ct === 'Multiselect') {
                this.options = f.get('options').value;
            }
        })
    }

    updateMultiOptions(input$: Observable<Array<ControlType | FormGroup>>): Observable<Array<ControlType | FormGroup>> {

        return input$.do( ([controlType, form]) => {
            const f = <FormGroup>form;
            const ct = <ControlType>controlType;

            if (ct === 'Multiselect') {
                if (f.get('multiSelectOptions') === null) f.addControl('multiSelectOptions', new FormControl([]));
                this.multiQuestions = f.get('multiSelectOptions').value;
            }
        })
    }

    deleteQuestion() { this.selectedQuestionID$.take(1).subscribe(id => this.delete.emit(id)); }

    ngOnDestroy() { this.destroySubs$.next(); }

    spliceOption(option){
        this.options = this.options.filter(opt => opt !== option);
    }

    updateMultiSelect(options){
        if (this.controlType === 'Multiselect') {

            this.form$.take(1).subscribe( (form: FormGroup) => {
                if (!form.get('multiSelectOptions')) {
                    form.addControl('multiSelectOptions', new FormControl([]));
                }

                form.get('multiSelectOptions').setValue(options);


                form.get(['key', 'name']).setValue(null);

                form.get('expandable').setValue(false);
            })
        }
    }

}

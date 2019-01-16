import { Component, OnInit, OnDestroy, EventEmitter, Output } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl, AbstractControl } from '@angular/forms';
import { ID, Key, ControlType } from '../../models';
import { Observable, ReplaySubject, Subject, combineLatest, of } from 'rxjs';
import { 
    map, 
    filter, 
    multicast, 
    refCount, 
    takeUntil, 
    withLatestFrom, 
    startWith, 
    pairwise,
    tap,
    throttleTime,
    delay,
    switchMap,
    debounceTime,
    pluck
} from 'rxjs/operators'
import { Store, select } from '@ngrx/store';
import * as fromRoot from '../../reducer';
import { getSelectedConstantID, getSelectedConditionalID } from "../store/screener-reducer"
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
        { value: 'NumberInput', display: 'number input' },
        { value: 'NumberSelect', display: 'select' },
        { value: 'Toggle', display: 'toggle' },
        { value: 'Multiselect', display: 'multiselect'}
    ].sort( (a, b) => a.display.trim().localeCompare(b.display.trim()));

    selectedQuestionID$;
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

        // this.selectedQuestionID$ = of('unselect all the questions')

        // data sources
        this.selectedQuestionID$ = combineLatest(
            getSelectedConstantID(this.store),
            getSelectedConditionalID(this.store)
        ).pipe(
            filter(Boolean),
            map( ([constant, conditional]: any[]) => {
                if (constant === undefined) {
                    return 'unselect all the questions';
                }

                if (conditional === undefined && constant !== undefined) {
                    return constant;
                }

                if (conditional !== undefined && constant !== undefined) {
                    return conditional;
                }

            }),
            multicast( new ReplaySubject(1)),
            refCount()
        )


        this.form$ = this.selectedQuestionID$
            .pipe(
                withLatestFrom(this.store.pipe(fromRoot.getForm)),
                filter( ([questionID, form]) => form.get(questionID) !== null),
                map( ([questionID, form]) => form.get(questionID)),
                startWith(this.fb.group({ label: [''], key: this.fb.group({ name: [''], type: [''] }), controlType: [''], expandable: [false], options: [] })),
                tap( (form: any) => {
                    this.controlType = form.get('controlType').value
                    const val = form.value;

                    if (val.controlType && val.controlType === 'Multiselect' && val.multiSelectOptions) {
                        this.multiQuestions = [...val.multiSelectOptions];
                    }
                }),
                multicast( new ReplaySubject(1)),
                refCount()
            )

        this.store.pipe(fromRoot.getUnusedScreenerKeys, takeUntil(this.destroySubs$.asObservable()))
            .subscribe( (keys: any[]) => this.unusedKeys = [...keys]);

        this.form$
            .pipe(
                takeUntil(this.destroySubs$.asObservable()),
                throttleTime(400),
                tap(_ => this.fadeState = 'out'),
                delay(300),
                tap(_ => this.fadeState = 'in'),
            ).subscribe();    
        // local form(s)

        const digit_pattern = '^\\d+$';

        this.optionForm = this.fb.group({
            optionValue: ['', Validators.required ]
        });

        // effects
        this.form$
            .pipe(
                filter(Boolean),
                map( form => form.get('key')),
                filter(Boolean),
                switchMap( key => key.valueChanges.pipe(startWith(key.value),pairwise()) ),
                debounceTime(100),
                takeUntil(this.destroySubs$.asObservable()),
                withLatestFrom(this.form$),
            )
            .subscribe( ([ keys, form]) => {
                const prevKey = keys[0];
                const currKey = keys[1];  
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
            .pipe(
                filter(Boolean),
                switchMap( form => form.get('controlType').valueChanges ),
                this.updateInternalControlType.bind(this),
                withLatestFrom(this.form$),
                this.updateOptions.bind(this),
                this.updateMultiOptions.bind(this),
                takeUntil(this.destroySubs$.asObservable()),
            ).subscribe();
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

import { Component, OnInit, Input, OnDestroy, Output, EventEmitter } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Subscription } from 'rxjs/Subscription';
import { ReplaySubject } from 'rxjs/ReplaySubject';
import { Observable } from 'rxjs/Observable';
import { QuestionControlService } from '../questions/question-control.service';
import 'rxjs/add/observable/merge';
import 'rxjs/add/operator/multicast';
import 'rxjs/add/operator/mapTo';
import {
    trigger,
    state,
    style,
    animate,
    transition,
} from '@angular/animations';

@Component({
    selector: 'app-ycb-question',
    templateUrl: './ycb-question.component.html',
    styleUrls: ['./ycb-question.component.css'],
    animations: [
        trigger('questionExpand', [
            state('expanded', style({ transform: 'translateX(0)', opacity: '1' })),
            state('collapsed', style({ transform: 'translateX(100%)', opacity: '0' })),
            transition('void => *', [
                style({ transform: 'translateX(-100%)', opacity: '0' }),
                animate('300ms ease-out')
            ]),
            transition('expanded => collapsed', [
                style({ transform: 'translateX(0)', opacity: '1' }),
                animate('300ms ease-out')
            ]),
        ]),
        trigger('error', [
            state('inDOM', style({ opacity: '1' })),
            state('outDOM', style({ opacity: '0' })),
            transition('inDOM => outDOM', [
                style({ opacity: '1' }),
                animate('300ms ease-out')
            ]),
            transition('outDOM => inDOM', [
                style({ opacity: '0' }),
                animate('300ms ease-out')
            ])
        ])
    ]
})
export class YcbQuestionComponent implements OnInit, OnDestroy {
    @Input() question;
    @Input() form: FormGroup;
    @Input() conditionalQuestions;
    @Output() onExpand = new EventEmitter<any>();
    @Output() onHide = new EventEmitter<any>();
    subscriptions: Subscription[] = [];
    showQuestions = false;
    expand;
    errorInDOM = 'outDOM';

    constructor(private qcs: QuestionControlService) { }

    ngOnInit() {

        if (this.isExpandableQuestion()) {
            // this.onExpand.emit(this.question.conditionalQuestions);

            const change = this.form.get(this.question.key).valueChanges
                .filter(value => typeof value === 'string' && (value === 'true' || value === 'false'))
                .map(val => val === 'true')
                .multicast(new ReplaySubject<boolean>(1)).refCount();


            const expand = change.filter(value => value === true)
                .do(_ => this.onExpand.emit({id: this.question.id, conditionals: this.question.conditionalQuestions}))
                .do(_ => this.expand !== 'expanded' ? this.expand = 'expanded' : null);

            const hide = change.filter(val => val === false)
                .do(_ => this.onHide.emit({id: this.question.id, conditionals: this.question.conditionalQuestions}))
                .do(_ => this.expand !== 'collapsed' ? this.expand = 'collapsed' : null);


            const merged = Observable.merge(expand, hide)
                .subscribe(hide => hide === true ? this.showQuestions = hide : null);


            this.subscriptions = [...this.subscriptions, merged];

        } else if (this.isNumberSelect()) {
            this.question.options.sort( (a, b) => a > b);
        } else if (this.isMultiSelect()) {
            const keys = this.question.multiSelectOptions.map(o => o.key.name);
            keys.forEach(keyName => {
                if (this.form.get(keyName)){
                    this.form.get(keyName).setValue(false);
                }
            });
        }
        /* TODO: consult with stakeholders on default value of false.
        else if (this.question.controlType === 'Toggle') {
            this.form.get(this.question.key).setValue(false);
        }*/
    }

    ngOnDestroy() {
        for (const sub of this.subscriptions) {
            if (!sub.closed) {
                sub.unsubscribe();
            }
        }
    }

    animationDone($event) {
        if ($event.toState === 'collapsed') {
            this.showQuestions = false;
        }
    }

    isExpandableQuestion() {
        return this.question.expandable &&
            Array.isArray(this.question.conditionalQuestions) &&
            this.question.conditionalQuestions.length > 0;
    }

    isNumberSelect() {
        const allNumbers = array => {
            for(const val of array) {
                if (typeof val !== 'number') return false;
            }
            return true;
        };


        return Array.isArray(this.question.options) && this.question.options.length > 0 && allNumbers(this.question.options);
    }

    isMultiSelect() {
        return Array.isArray(this.question.multiSelectOptions) && this.question.multiSelectOptions.length > 0;
    }

    checkEnter(keyDownEvent) {
        const ENTER_KEY = 13;
        if (keyDownEvent.keyCode === ENTER_KEY) keyDownEvent.target.blur();
    }

    handleInput(textInput: string) {
        const isValid = this.form.get(this.question.key).valid;

        if (!isValid) {
            this.addError();
        } else if (isValid && this.form.hasError('invalid input', [this.question.key, 'number'])) {
            console.warn(`form has error on key: ${this.question.key}, but the form says it is valid: ${isValid}`);
        }

        if (!isValid && this.errorInDOM === 'outDOM'){
            this.errorInDOM = 'inDOM';
        }
        else if (isValid && this.errorInDOM === 'inDOM'){
            this.errorInDOM = 'outDOM';
        }
    }

    addError() {
        this.form.setErrors({
            ...this.form.errors,
            [this.question.key]: {number: 'invalid input'}
        })
    }
}

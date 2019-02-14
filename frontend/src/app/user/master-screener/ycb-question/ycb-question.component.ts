import { Component, OnInit, Input, OnDestroy, Output, EventEmitter } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Subscription, ReplaySubject, merge } from 'rxjs';
import { filter, map, multicast, refCount, tap } from 'rxjs/operators';
import { QuestionControlService } from '../questions/question-control.service';
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
    @Input() screenerQuestion;
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
            const change = this.form.get(this.screenerQuestion.id).valueChanges
                .pipe(
                    filter(value => typeof value === 'string' && (value === 'true' || value === 'false')),
                    map(val => val === 'true'),
                    multicast(new ReplaySubject<boolean>(1)),
                    refCount()
                )
                


            const expand = change.pipe(
                filter(value => value === true),
                tap(_ => this.onExpand.emit({id: this.screenerQuestion.id, conditionals: this.screenerQuestion.conditionalQuestions})),
                tap(_ => this.expand !== 'expanded' ? this.expand = 'expanded' : null)
            );
                

            const hide = change.pipe(
                filter(val => val === false),
                tap(_ => this.onHide.emit({id: this.screenerQuestion.id, conditionals: this.screenerQuestion.conditionalQuestions})),
                tap(_ => this.expand !== 'collapsed' ? this.expand = 'collapsed' : null)
            );


            const merged = merge(expand, hide)
                .subscribe(hide => hide === true ? this.showQuestions = hide : null);


            this.subscriptions = [...this.subscriptions, merged];

        } else if (this.isNumberSelect()) {
            this.screenerQuestion.options.sort( (a, b) => a > b);
        } else if (this.isMultiSelect()) {
            const questions = this.screenerQuestion.multiSelectOptions.map(q => q.id);
            questions.forEach(id => {
                if (this.form.get(id)){
                    this.form.get(id).setValue(false);
                }
            });
        }
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
        return this.screenerQuestion.expandable &&
            Array.isArray(this.screenerQuestion.conditionalQuestions) &&
            this.screenerQuestion.conditionalQuestions.length > 0;
    }

    isNumberSelect() {
        const allNumbers = array => {
            for(const val of array) {
                if (typeof val !== 'number') return false;
            }
            return true;
        };


        return Array.isArray(this.screenerQuestion.options) && this.screenerQuestion.options.length > 0 && allNumbers(this.screenerQuestion.options);
    }

    isMultiSelect() {
        return Array.isArray(this.screenerQuestion.multiSelectOptions) && this.screenerQuestion.multiSelectOptions.length > 0;
    }

    checkEnter(keyDownEvent) {
        const ENTER_KEY = 13;
        if (keyDownEvent.keyCode === ENTER_KEY) keyDownEvent.target.blur();
    }

    handleInput(textInput: string) {
        const isValid = this.form.get(this.screenerQuestion.id).valid;

        if (!isValid) {
            this.addError();
        } else if (isValid && this.form.hasError('invalid input', [this.screenerQuestion.text, 'number'])) {
            console.warn(`form has error on key: ${this.screenerQuestion.text}, but the form says it is valid: ${isValid}`);
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
            [this.screenerQuestion.id]: {number: 'invalid input'}
        })
    }
}

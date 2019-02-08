import { Component, OnInit, OnDestroy, Input, Output, EventEmitter } from '@angular/core';
import { Subject, combineLatest } from 'rxjs';
import { takeUntil, take } from 'rxjs/operators'
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { Store } from '@ngrx/store';
import * as fromRoot from '../../../reducer';

@Component({
    selector: 'app-mult-select-questions',
    templateUrl: './mult-select-questions.component.html',
    styleUrls: ['./mult-select-questions.component.css']
})
export class MultSelectQuestionsComponent implements OnInit, OnDestroy {
    @Input() options: Array<any>;
    @Output() update = new EventEmitter<Array<any>>();
    destroySubs$ = new Subject();
    form: FormGroup;

    constructor(private store: Store<fromRoot.State>, private fb: FormBuilder) {}

    ngOnInit() {

        this.form = this.fb.group({
            'id': [''],
            'text': ['', Validators.required]
        });

        if (!this.options) {
            this.options = [];
        }
    }

    ngOnDestroy() {
        this.destroySubs$.next();
    }

    commit() {
        let val = this.form.value;
        let existingOption = this.options.find(opt => opt.id === val.id);
        if (existingOption) {
            Object.assign(existingOption, val)
        } else {
            this.form.get('id').setValue(this.randomString())
            val = this.form.value;
            this.options.push(val);
        }

        this.update.emit(this.options);
        this.form.reset();
    }

    handleDelete(id) {
        this.options = this.options.filter(opt => opt.id !== id);
        this.update.emit(this.options);
    }

    handleEdit(id) {
        const option = this.options.find(opt => opt.id === id);
        if (option) {
            this.form.get('text').setValue(option.text);
            this.form.get('id').setValue(option.id);
        }
    }

    private randomString() {
        const charSet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        let randomString = '';
        for (let i = 0; i < 20; i++) {
            let randomPoz = Math.floor(Math.random() * charSet.length);
            randomString += charSet.substring(randomPoz, randomPoz + 1);
        }
        return randomString;
    }
}

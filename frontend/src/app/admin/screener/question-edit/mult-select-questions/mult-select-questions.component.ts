import {Component, OnInit, OnDestroy, Input, Output, EventEmitter} from '@angular/core';
import { Subject } from 'rxjs/Subject';
import {FormGroup, FormBuilder, Validators, FormControl} from '@angular/forms';
import { Key } from '../../../models';
import { Store } from '@ngrx/store';
import * as fromRoot from '../../../reducer';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/takeUntil';
import 'rxjs/add/operator/combineLatest';

@Component({
    selector: 'app-mult-select-questions',
    templateUrl: './mult-select-questions.component.html',
    styleUrls: ['./mult-select-questions.component.css']
})
export class MultSelectQuestionsComponent implements OnInit, OnDestroy {
    @Input() options: Array<any>;
    @Output() update = new EventEmitter<Array<any>>();
    unusedKeys: Key[] = [];
    committedKeys: Key[] = [];
    destroySubs$ = new Subject();
    form: FormGroup;


    constructor(private store: Store<fromRoot.State>, private fb: FormBuilder) {}

    ngOnInit() {
        this.store.let(fromRoot.getUnusedScreenerKeys)
            .takeUntil(this.destroySubs$.asObservable())
            .subscribe( keys => this.unusedKeys = [...keys].filter(key => key.type === 'boolean').sort((a, b) => a.name.localeCompare(b.name)));

        this.form = this.fb.group({
            'key': new FormGroup({
                name: new FormControl('', Validators.required),
                type: new FormControl('', Validators.required)
            }),
            'text': ['', Validators.required]
        });

        this.form.get('key').get('name').valueChanges
            .combineLatest(this.store.let(fromRoot.getScreenerKeys))
            .takeUntil(this.destroySubs$.asObservable())
            .subscribe(([keyName, allKeys]) => {
                const key = allKeys.find(k => k.name === keyName);
                if (key) {
                    this.form.get(['key', 'type']).setValue(key.type);
                }
            });

        if (!this.options) {
            this.options = [];
        }
    }

    ngOnDestroy() {
        this.destroySubs$.next();
    }

    commit() {
        const val = this.form.value;
        let existingOption = this.options.find(opt => opt.key.name === val.key.name);

        if (existingOption) {
             Object.assign(existingOption, val);
        } else {
            this.options.push(val);
            this.unusedKeys = this.unusedKeys.filter(key => key.name !== val.key.name).sort((a, b) => a.name.localeCompare(b.name));
            this.committedKeys = [val.key, ...this.committedKeys];
        }
        this.update.emit(this.options);
        this.form.reset();
        this.form.get('key').reset();
    }

    handleDelete(keyName) {
        this.options = this.options.filter(opt => opt.key.name !== keyName);
        const releasedKey = this.committedKeys.find(k => k.name === keyName);
        if (releasedKey) {
            this.committedKeys.filter(k => k.name !== releasedKey.name);
            this.unusedKeys = [releasedKey, ...this.unusedKeys];
        } else {
            this.store.let(fromRoot.getScreenerKeys)
                .take(1)
                .subscribe(keys => {
                    const deletedKey = keys.find(k => k.name === keyName);
                    if (deletedKey) {
                        this.unusedKeys = [deletedKey, ...this.unusedKeys];
                    }
                })
        }

        this.update.emit(this.options);
    }

    handleEdit(keyName) {
        const option = this.options.find(opt => opt.key.name === keyName);
        if (option) {
            debugger;
            this.form.get('text').setValue(option.text);

            this.form.get('key').get('name').setValue(option.key.name);
            this.form.get('key').get('type').setValue(option.key.type);
            this.store.let(fromRoot.getScreenerKeys)
                .take(1)
                .subscribe(keys => {
                    const deletedKey = keys.find(k => k.name === keyName);
                    if (deletedKey) {
                        this.unusedKeys = [deletedKey, ...this.unusedKeys];
                        let noDups = [...this.unusedKeys];
                        for (let i = 0; i < this.unusedKeys.length; i++) {
                            const key = this.unusedKeys[i];
                            for (let j = i + 1; j < this.unusedKeys.length; j++) {
                                const nextKey = this.unusedKeys[j];
                                if (JSON.stringify(key) === JSON.stringify(nextKey)) {
                                    noDups = noDups.filter(key => key.name !== nextKey.name);
                                    noDups.push(nextKey);
                                }
                            }
                        }

                        this.unusedKeys = noDups.sort( (a, b) => a.name.localeCompare(b.name));
                    }
                })
        }
    }
}

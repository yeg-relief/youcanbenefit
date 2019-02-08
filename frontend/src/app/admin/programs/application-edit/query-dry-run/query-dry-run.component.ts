import { Component, Input, OnChanges } from '@angular/core';
import { ProgramQueryClass } from '../../services/program-query.class';
import { FormGroup, FormBuilder, FormControl } from '@angular/forms';
import { Subscription } from 'rxjs';
import { group } from '@angular/animations';

@Component({
    selector: 'query-dry-run',
    templateUrl: './query-dry-run.html',
    styleUrls: ['./query-dry-run.css']
})
export class QueryDryRunComponent implements  OnChanges {
    @Input() programQuery: ProgramQueryClass;
    private selectedQueryChanges: Subscription = null;
    public keys: any[];
    public query: FormGroup;
    public data: any[];

    constructor(private fb: FormBuilder) {}

    ngOnChanges(){
        const { value, valueChanges } = this.programQuery.form
        if (this.selectedQueryChanges !== null){
            this.selectedQueryChanges.unsubscribe()
        }
        this.selectedQueryChanges = valueChanges.subscribe(this._buildQuery)
        this._buildQuery(value)
    }

    private _buildQuery: (value: any) => void = (value) => {
        function zip(a: any[], b: any[]) {
            let result = [];
            for(let i = 0; i < a.length; i++) {
                result.push([ a[i], b[i] ])
            }
            return result
        }

        function pluckKey({ key }){
            return key;
        }
        function getKeyValue(condition){
            console.log(condition.key.type)
            switch(condition.key.type) {
                case "integer": {
                    return 0
                }

                case "boolean": {
                    return true;
                }

                default: {
                    console.log(condition.key.type)
                    return 0;
                }
            }
        }
        function buildGroup(group, condition){
            if (condition && Object.keys(condition).length) {
                const key = condition.key
                const control = new FormControl(getKeyValue(condition))
                group[key.name] = control
            }
            return group
        }
        this.keys = value.conditions.map(pluckKey)
        this.query = this.fb.group(value.conditions.reduce(buildGroup, {}))
        console.log(this.query)
        this.query.valueChanges.subscribe(console.log)
    }
}
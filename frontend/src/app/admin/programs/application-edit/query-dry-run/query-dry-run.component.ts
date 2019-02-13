import { Component, Input, OnChanges } from '@angular/core';
import { ProgramQueryClass } from '../../services/program-query.class';
import { FormGroup } from '@angular/forms';
import { Subscription } from 'rxjs';
import { QueryDryRunService } from './query-dry-run.service';

@Component({
    selector: 'query-dry-run',
    templateUrl: './query-dry-run.html',
    styleUrls: ['./query-dry-run.css']
})
export class QueryDryRunComponent implements  OnChanges {
    @Input() programQuery: ProgramQueryClass;
    private inputQueryChanges: Subscription = null;
    private dryRunValuesChange: Subscription = null;
    private recordedValues: any = null;
    public keys: any[];
    public query: FormGroup;
    public data: any[];
    public programs = [];

    constructor(private service: QueryDryRunService) {}

    ngOnChanges(){
        const { value, valueChanges } = this.programQuery.form
        const { service: { buildQuery }, query } = this;
        if (this.inputQueryChanges !== null){
            this.inputQueryChanges.unsubscribe()
        }
        this.inputQueryChanges = valueChanges.subscribe(value => {
            this.assignValues(buildQuery(value));
        })        
        this.assignValues(buildQuery(value));
    }

    private assignValues = (object) => {
        if (this.dryRunValuesChange !== null) {
            this.inputQueryChanges.unsubscribe()
        }
        this.keys = object.keys.sort((a, b) => a.name.localeCompare(b.name));
        this.query = object.query;
        this.dryRunValuesChange = this.query.valueChanges.subscribe(values => {
            this.recordedValues = {...values}
        })

        if (this.recordedValues) {
            this.query.patchValue(this.recordedValues)
        }
    }

    public runQuery(){
        this.service.runQuery(this.query.value).subscribe(programs => {
            this.programs = programs
        })
    }
}
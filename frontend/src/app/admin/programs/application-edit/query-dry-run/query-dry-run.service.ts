import { Injectable } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../../environments/environment'
@Injectable()
export class QueryDryRunService {
    
    constructor(
        private fb: FormBuilder,
        private http: HttpClient
    ){}

    public runQuery: (value: any) => {[key: string]: any} = value => {
        return this.http.post(`${environment.api}/api/notification/`, value)
    }
 

    public buildQuery: (value: any) => {[key: string]: any} = (value) => {
        function pluckKey({ key }){
            return key;
        }
        function getKeyValue(condition){
            switch(condition.key.type) {
                case "integer": {
                    return 0
                }

                case "boolean": {
                    return true;
                }

                case "number": {
                    return 0;
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
        const keys = value.conditions.map(pluckKey)
        const query = this.fb.group(value.conditions.reduce(buildGroup, {}))
        return { keys, query }
    }
}
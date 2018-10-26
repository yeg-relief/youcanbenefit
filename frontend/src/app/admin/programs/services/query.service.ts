import { Injectable } from '@angular/core';
import { Http, RequestOptions } from '@angular/http';
import { ProgramQueryClass } from './program-query.class';
import { AuthService } from '../../core/services/auth.service'
import { Observable } from 'rxjs/Observable';
import { ReplaySubject } from 'rxjs/ReplaySubject';
import { QueryEvent } from './index';
import {ProgramConditionClass} from "./program-condition.class";

@Injectable()
export class QueryService {
    update = Symbol();
    broadcast = new ReplaySubject<QueryEvent>();
    constructor(private http: Http, private authService: AuthService,) {}

    private getCredentials(): RequestOptions {
        return this.authService.getCredentials();
    }



    createOrUpdate(query: ProgramQueryClass, program_guid: string) {
        if (!query.form.valid) return;

        query.conditions = QueryService.parseStringValues(query.conditions);

        query.conditions = QueryService.removeEmptyValues(query.conditions);

        const creds = this.getCredentials();
        creds.headers.append('Content-Type', 'application/json' );
        const data = {
            query: query.form.value,
            guid: program_guid
        };

        return this.http.post('/protected/query/', data, creds)
            .map(res => res.json())
            .do( res => {
                if (res.created === true || res.result === 'updated') {
                    query.conditions = query.conditions.sort( (a, b) => a.data.key.name.localeCompare(b.data.key.name));
                    this.broadcast.next({
                        id: query.data.id,
                        data: query,
                        type: this.update
                    })
                }
            })
            .catch(QueryService.loadError)
    }

    deleteQuery(query_id: string) {
        const creds = this.getCredentials();
        creds.headers.append( 'Content-Type', 'application/json' );
        return this.http.delete(`/protected/query/${query_id}`, creds)
            .map(res => res.json())
            .map(res => res.found && res.deleted);
    }

    static loadError(error: Response | any) {
        let errMsg: string;
        if (error instanceof Response) {
            const body = error.json() || '';
            errMsg = body['message'] || JSON.stringify(body);
        } else {
            errMsg = error.message ? error.message : error.toString();
        }
        return Observable.throw(errMsg);
    }

    static parseStringValues(conditions: ProgramConditionClass[]): ProgramConditionClass[] {
        return conditions.map((c: ProgramConditionClass) => {
            const type = c.form.get(['key', 'type']).value;

            return type === 'number' ? QueryService.executeParse(c) : c
        });
    }

    static removeEmptyValues(conditions: ProgramConditionClass[]): ProgramConditionClass[] {
        for (const c of conditions) {
            let val = c.form.value.value;
            if (typeof val === 'string' && val.match(/[^$,.\d]/)){
                throw new Error(`invalid value detected: ${c.form.value.value}`);
            } else if (typeof val === 'string') {
                c.form.get('value').setValue(Number.parseInt(val, 10));
            } else if (typeof val === 'number') {
                c.form.get('value').setValue(Number.parseInt( val.toString(10), 10));
            }
        }

        return conditions;
    }

    static executeParse(condition: ProgramConditionClass) : ProgramConditionClass {
        let formValue = condition.form.get('value')
        formValue.setValue(Number.parseInt((<string>formValue.value), 10));

        if (Number.isNaN(condition.form.value.value)) {
            throw new Error(`A condition with name: ${condition.data.key.name} is an invalid number.`);
        }

        return condition;
    }
}

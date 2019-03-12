
import { throwError as observableThrowError, ReplaySubject } from 'rxjs';
import { tap, map, catchError } from 'rxjs/operators'
import { Injectable } from '@angular/core';
import { Http, RequestOptions } from '@angular/http';
import { ProgramQueryClass } from './program-query.class';
import { AuthService } from '../../core/services/auth.service'
import { QueryEvent } from './index';
import {ProgramConditionClass} from "./program-condition.class";
import { environment } from '../../../../environments/environment'

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

        return this.http.post(`${environment.api}/protected/query/`, data, creds)
            .pipe(
                map(res => res.json()),
                tap( res => {
                    if (res.result === 'created' || res.result === 'updated') {
                        query.conditions = query.conditions.sort( (a, b) => a.data.question.text.localeCompare(b.data.question.text));
                        this.broadcast.next({
                            id: query.data.id,
                            data: query,
                            type: this.update
                        })
                    }
                }),
                catchError(QueryService.loadError)
            )
    }

    deleteQuery(query_id: string) {
        const creds = this.getCredentials();
        creds.headers.append( 'Content-Type', 'application/json' );
        return this.http.delete(`${environment.api}/protected/query/${query_id}`, creds)
            .pipe(map(res => {
                const json = res.json()
                return json.found && json.deleted
            }))
    }

    static loadError(error: Response | any) {
        let errMsg: string;
        if (error instanceof Response) {
            const body = error.json() || '';
            errMsg = body['message'] || JSON.stringify(body);
        } else {
            errMsg = error.message ? error.message : error.toString();
        }
        return observableThrowError(errMsg);
    }

    static parseStringValues(conditions: ProgramConditionClass[]): ProgramConditionClass[] {
        return conditions.map((c: ProgramConditionClass) => {
            const type = c.form.get(['question', 'type']).value;
            
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
                c.form.get('value').setValue(val);
            }
        }

        return conditions;
    }

    static executeParse(condition: ProgramConditionClass) : ProgramConditionClass {
        let formValue = condition.form.get('value')
        formValue.setValue(Number.parseInt((<string>formValue.value), 10));

        if (Number.isNaN(condition.form.value.value)) {
            throw new Error(`A condition with name: ${condition.data.question.text} is an invalid number.`);
        }

        return condition;
    }
}

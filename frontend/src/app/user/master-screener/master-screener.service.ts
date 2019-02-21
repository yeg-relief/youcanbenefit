
import {throwError as observableThrowError,  Observable } from 'rxjs';
import { map, catchError, tap, } from 'rxjs/operators'
import { Injectable } from '@angular/core';
import { ScreenerQuestion } from '../../shared';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { FormGroup } from "@angular/forms";
import { ProgramsServiceService } from "../programs-service.service";
import { environment } from '../../../environments/environment';

@Injectable()
export class MasterScreenerService {
    results = [];
    constructor(private http: Http, private programService: ProgramsServiceService) { }

    loadQuestions(): Observable<ScreenerQuestion[]> {
        return this.http.get(`${environment.api}/api/screener/`)
            .pipe(
                map(res => res.json()),
                catchError(MasterScreenerService.handleError)
            )
    }

    loadResults(form: FormGroup) {
        const updatedForm = MasterScreenerService.checkForInvalid(form);
        const transformedFormValues = MasterScreenerService.transformValuesFromString(updatedForm);
        const headers = new Headers({ 'Content-Type': 'application/json' });
        const options = new RequestOptions({ headers: headers });
        const body = JSON.stringify({ ...transformedFormValues });
        return this.http.post(`${environment.api}/api/notification/`, body, options)
            .pipe(
                map(res => res.json()),
                tap(programs => this.programService.addPrograms(programs)),
                catchError(MasterScreenerService.loadError)
            ).toPromise()
    }

    static checkForInvalid(form: FormGroup): FormGroup {
        if (!form.valid) {
            for (const key in form.errors) {
                if (form.errors.hasOwnProperty(key) && form.get(key)){
                    form.removeControl(key);
                }
            }
        }
        return form;
    }

    static transformValuesFromString(form: FormGroup): Object {
        let values = form.value;

        for (const key in values) {

            if ( values.hasOwnProperty(key) ) {
                let val = values[key];

                if ( (val === 'true' || val === 'false')  ) {
                    values[key] = val === 'true';
                }

                if ( !Number.isNaN(Number.parseInt(val, 10) ) ) {
                    values[key] = Number.parseInt(val, 10);
                }
            }
        }

        return values;
    }

    static handleError(error: Response | any): Observable<any> {
        let errMsg: string;
        if (error instanceof Response) {
            let body;
            try {
                body = error.json();
            } catch (e) {
                body = ''
            }
            errMsg = body.message || JSON.stringify(body);
        } else {
            errMsg = error.message ? error.message : error.toString();
        }
        return observableThrowError({ error : errMsg });
    }


    static loadError(error: Response | any) {
        let errMsg: string;
        if (error instanceof Response) {
            const body = error.json() || '';
            errMsg = body.message || JSON.stringify(body);
        } else {
            errMsg = error.message ? error.message : error.toString();
        }
        console.error(errMsg);
        return observableThrowError(errMsg);
    }
}

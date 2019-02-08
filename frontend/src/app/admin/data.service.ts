import { map, catchError  } from 'rxjs/operators'
import {throwError as observableThrowError,  Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { Http, Response, RequestOptions } from '@angular/http';
import { AuthService } from './core/services/auth.service'
import { environment } from '../../environments/environment'





@Injectable()
export class DataService {

    constructor(private authService: AuthService) {}

    loadError(error: Response | any) {
        console.error(error);
        let errMsg: string;
        if (error instanceof Response) {
            const body = error.json() || '';
            errMsg  = body.message || JSON.stringify(body);
        } else {
            errMsg = error.message ? error.message : error.toString();
        }
        console.error(errMsg);
        return observableThrowError(errMsg);
    }


}
import { map, catchError  } from 'rxjs/operators'
import {throwError as observableThrowError,  Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { Key } from './models/key';
import { Http, Response, RequestOptions } from '@angular/http';
import { AuthService } from './core/services/auth.service'
import { environment } from '../../environments/environment'





@Injectable()
export class DataService {
    private keys$: Observable<Key[]>;

    constructor(private http: Http, private authService: AuthService) {}

    private getCredentials(): RequestOptions{
        return this.authService.getCredentials();
    }

    getKeys() {
        const creds = this.getCredentials();
        return this.keys$ = this.http.get(`${environment.api}/protected/key/`, creds)
        .pipe(
            map(res => res.json()),
            catchError(this.loadError)
        );
    }


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

    // updateKey is really more like createKey
    updateKey(key: Key) {
        const creds = this.getCredentials();
        creds.headers.append('Content-Type', 'application/json' );
        const body = JSON.stringify({ key: key });
        return this.http.post(`${environment.api}/protected/key/`, body, creds)
        .pipe(
            map(res => res.json().update),
            catchError(this.loadError)
        );
    }
}
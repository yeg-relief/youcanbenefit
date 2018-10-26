import { Injectable } from '@angular/core';
import { Key } from './models/key';
import { Observable } from 'rxjs/Observable';
import { Http, Response, RequestOptions } from '@angular/http';
import { AuthService } from './core/services/auth.service'
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/reduce';
import 'rxjs/add/operator/mergeMap'

@Injectable()
export class DataService {
    private keys$: Observable<Key[]>;

    constructor(private http: Http, private authService: AuthService) {}

    private getCredentials(): RequestOptions{
        return this.authService.getCredentials();
    }

    getKeys() {
        const creds = this.getCredentials();
        return this.keys$ = this.http.get('/protected/key/', creds)
            .map(res => res.json())
            .catch(this.loadError);
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
        return Observable.throw(errMsg);
    }

    // updateKey is really more like createKey
    updateKey(key: Key) {
        const creds = this.getCredentials();
        creds.headers.append('Content-Type', 'application/json' );
        const body = JSON.stringify({ key: key });
        return this.http.post(`/protected/key/`, body, creds)
            .map(res => res.json().update)
            .catch(this.loadError)
    }
}
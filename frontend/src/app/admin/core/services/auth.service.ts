import { Injectable } from '@angular/core';
import {Http, Headers, RequestOptions} from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { environment } from '../../../../environments/environment';

declare const btoa;

@Injectable()
export class AuthService {
    isLoggedIn: boolean =  !environment.production;
    private credentials: string;
    // store the URL so we can redirect after logging in
    redirectUrl = 'admin/screener/edit';

    constructor(private http: Http){}

    login(user: string, password: string): Observable<boolean> {
        const auth = btoa(user + ":" + password);
        const headers = new Headers();
        headers.append("Authorization", "Basic " + auth);
        const options = new RequestOptions({ headers: headers });

        return this.http.get('/protected/login/', options)
            .map(res => res.json().created)
            .do(success => this.isLoggedIn = success)
            .do(success => {
                if(success) {
                    this.credentials = auth;
                }
            })
    }

    logout(): void {
        this.isLoggedIn = false;
        this.credentials = '';
    }

    getCredentials(): RequestOptions {
        const headers = new Headers();
        headers.append("Authorization", "Basic " + this.credentials);
        return new RequestOptions({ headers: headers });
    }
}

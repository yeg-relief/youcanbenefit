
import { ReplaySubject } from 'rxjs';
import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { environment } from '../../../environments/environment';
import { map, tap, multicast, refCount, switchMap, pluck, reduce } from 'rxjs/operators'

@Injectable()
export class AboutService {
    documents;

    constructor(private http: Http) {
        this.documents =  this.http.get(`${environment.api}/api/document/about`).toPromise();
    }


    async getDocument(): Promise<string>  {
        const httpRes = await this.http.get(`${environment.api}/api/document/about`).toPromise();
        
        // const httpRes = await this.documents;
        return decodeURIComponent(httpRes.url);
    }

}

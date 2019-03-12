
import { ReplaySubject } from 'rxjs';
import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { environment } from '../../../environments/environment';
import { map, tap, multicast, refCount, switchMap, pluck, reduce } from 'rxjs/operators'

@Injectable()
export class AboutService {
    documents$;

    constructor(private http: Http) {
        this.documents$ =  this.http.get(`${environment.api}/api/document/about`)
                                        .pipe(
                                            map(res => res.json()),
                                            multicast(new ReplaySubject(1)),
                                            refCount()
                                        )
    }

    getAboutPage(): Promise<string>  {
        let prom = this.documents$.toPromise();
        console.log(prom);
        return prom;
    }

}

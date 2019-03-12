
import { ReplaySubject } from 'rxjs';
import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { environment } from '../../../environments/environment';
import { map, tap, multicast, refCount, switchMap, pluck, reduce, take } from 'rxjs/operators';
import { Page } from '../../shared/models';

@Injectable()
export class AboutService {
    page$;

    constructor(private http: Http) {
        this.page$ =  this.http.get(`${environment.api}/api/page/about`)
                                        .pipe(
                                            map(res => res.json()),
                                            multicast(new ReplaySubject(1)),
                                            refCount()
                                        )
    }

    getPage(): Promise<Page>  {
        return this.page$.toPromise();
    }

    savePage(page: Page) {
        return this.http.post(`${environment.api}/protected/page`, page)
                .pipe(
                    map(res => res.json())
                );
    }

}
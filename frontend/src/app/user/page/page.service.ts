import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { environment } from '../../../environments/environment';
import { map } from 'rxjs/operators';
import { Page } from '../../shared/models';

@Injectable()
export class PageService {

    constructor(private http: Http) {}

    getPage(): Promise<Page>  {
        return this.http.get(`${environment.api}/api/page/about`).pipe(map(res => res.json())).toPromise();
    }

    savePage(page: Page) {
        return this.http.post(`${environment.api}/protected/page`, page).pipe(map(res => res.json()));
    }

}
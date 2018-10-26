import { Injectable } from '@angular/core';
import { Router } from "@angular/router";

@Injectable()
export class InitialRedirectService {

    constructor(private router: Router) { }

    doRedirect() {
        const queryString = window.location.search;
        if (!queryString){
            return;
        }

        const queryMap = this.parseQuery(window.location.search);

        let path = '/';

        if (queryMap['path']) {
            path += queryMap['path'];
        }

        if (queryMap['subPath']) {
            path += `/${queryMap['subPath']}`
        }

        if (queryMap['detail']) {
            path += `/details/${queryMap['detail']}`
        }

        this.router.navigateByUrl(path);
    }

    parseQuery(qstr): {[key: string]: string} {
        const query = {};
        const a = (qstr[0] === '?' ? qstr.substr(1) : qstr).split('&');
        for (let i = 0; i < a.length; i++) {
            const b = a[i].split('=');
            query[decodeURIComponent(b[0])] = decodeURIComponent(b[1] || '');
        }
        return query;
    }

}

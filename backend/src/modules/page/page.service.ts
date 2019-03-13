import { Injectable } from '@nestjs/common';
import { DocumentDto } from './document.dto';
import { ClientService } from "../db.elasticsearch/client.service"
import "rxjs/add/observable/fromPromise"
import * as sanitizeHtml from "sanitize-html";
import { PageDto } from "./page.dto";
import { Observable } from 'rxjs/Observable';
@Injectable()
export class PageService {
    private readonly INDEX = "pages";
    private readonly TYPE = "user_facing";
    private readonly baseParams = {
        index: this.INDEX,
        type: this.TYPE
    };

    constructor(
        private readonly clientService: ClientService
    ) {}

    createOrUpdate(page: PageDto): Promise<any> {
        page.documents.forEach((document: DocumentDto) => {
            document.content = sanitizeHtml(document.content, {
                allowedTags: ['h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'blockquote', 'p', 'a', 'ul', 'ol', 
                'nl', 'li', 'b', 'i', 'u', 'strong', 'em', 'strike', 'code', 'hr', 'br', 'div',
                'table', 'thead', 'caption', 'tbody', 'tr', 'th', 'td', 'pre', 'iframe', 'img'],
                allowedAttributes: {
                    '*' : [ 'class', 'style' ],
                    'a' : [ 'href', 'name', 'target' ],
                    'img' : [ 'src' ]
                }
            });
        });

        page.created = Date.now();
        return this.clientService.index(page, this.INDEX, this.TYPE, page.title);
    }

    getByTitle(title: string): Observable<PageDto> {
        return Observable.fromPromise(this.clientService.getById(this.baseParams, title));
    }

}
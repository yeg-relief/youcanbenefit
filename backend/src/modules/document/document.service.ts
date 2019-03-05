import { Injectable } from '@nestjs/common';
import { DocumentDto } from './document.dto';
import { ClientService } from "../db.elasticsearch/client.service"
import { Observable } from "rxjs/Observable";
import "rxjs/add/observable/fromPromise"
import "rxjs/add/operator/map"
import "rxjs/add/operator/do"
import * as sanitizeHtml from "sanitize-html";
const uuidv4 = require("uuid/v4");
@Injectable()
export class DocumentService {
    private readonly INDEX = "documents";
    private readonly TYPE = "user_facing";
    private readonly baseParams = {
        index: this.INDEX,
        type: this.TYPE
    };

    constructor(
        private readonly clientService: ClientService
    ) {
        
    }

    create(document: DocumentDto): Promise<any> {
        document.content = sanitizeHtml(document.content, {
            allowedTags: ['h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'blockquote', 'p', 'a', 'ul', 'ol',
            'nl', 'li', 'b', 'i', 'strong', 'em', 'strike', 'code', 'hr', 'br', 'div',
            'table', 'thead', 'caption', 'tbody', 'tr', 'th', 'td', 'pre', 'iframe'],
            allowedAttributes: {
                '*' : [ 'class', 'style' ],
                'a' : [ 'href', 'name', 'target' ],
                'img' : [ 'src' ]
            }
        });
        return this.clientService.create(document, this.INDEX, this.TYPE, document.title);
    }

    async getByTitle(title: string): Promise<string> {
        const document = await this.clientService.getById(this.baseParams, title);
        return document.content;
    }

}
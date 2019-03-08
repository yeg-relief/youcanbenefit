import { Injectable } from '@nestjs/common';
import { ProgramDto } from './program.dto';
import { Client } from "elasticsearch";
import { ClientService } from "../db.elasticsearch/client.service"
import { Observable } from "rxjs/Observable";
import "rxjs/add/observable/fromPromise"
import "rxjs/add/operator/map"
import "rxjs/add/operator/do"
import * as sanitizeHtml from 'sanitize-html';
const uuidv4 = require("uuid/v4");

@Injectable()
export class ProgramService {
    private readonly INDEX = "programs";
    private readonly TYPE = "user_facing";
    private client: Client;
    private readonly baseParams = {
        index: this.INDEX,
        type: this.TYPE
    };

    constructor(
        private readonly clientService: ClientService
    ) {
        this.client = this.clientService.client;
    }

    create(program: ProgramDto): Promise<any> {
        return this.clientService.create(program, this.INDEX, this.TYPE, program.guid);
    }

    findAll(): Observable<ProgramDto[]> {
        return Observable.fromPromise( this.clientService.findAll(this.baseParams) )
    }

    index(program: ProgramDto) {
        program.created = Date.now();
        program.details = sanitizeHtml(program.details, {
            allowedTags: ['h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'blockquote', 'p', 'a', 'ul', 'ol',
            'nl', 'li', 'b', 'i', 'strong', 'em', 'strike', 'hr', 'br', 'div',
            'table', 'thead', 'caption', 'tbody', 'tr', 'th', 'td', 'pre', 'iframe'],
            allowedAttributes: {
                '*' : [ 'class', 'style' ],
                'a' : [ 'href', 'name', 'target' ]
            }
        })
        return this.clientService.index(program, this.INDEX, this.TYPE, program.guid)
    }

    async getByGuid(guid: string): Promise<ProgramDto> {
        return this.clientService.getById(this.baseParams, guid);
    }

    async mGetByGuid(guids: string[]): Promise<ProgramDto[]> {
        return this.clientService.mGetById(guids, this.INDEX, this.TYPE);
    }

    deleteByGuid(guid: string): Observable<any> {
        return Observable.fromPromise (this.clientService.delete(this.INDEX, this.TYPE, guid) );
    }
}
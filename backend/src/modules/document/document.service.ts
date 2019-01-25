import { Injectable } from '@nestjs/common';
import { DocumentDto } from './document.dto';
import { ClientService } from "../db.elasticsearch/client.service"
import { Observable } from "rxjs/Observable";
import "rxjs/add/observable/fromPromise"
import "rxjs/add/operator/map"
import "rxjs/add/operator/do"
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
        return this.clientService.create(document, this.INDEX, this.TYPE, document.guid);
    }

}
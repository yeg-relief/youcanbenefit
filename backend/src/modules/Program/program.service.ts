import { Component } from '@nestjs/common';
import { ProgramDto } from './program.dto';
import { Client } from "elasticsearch";
import { ClientService } from "../db.elasticsearch/client.service"
import { Observable } from "rxjs/Observable";
import "rxjs/add/observable/fromPromise"
import "rxjs/add/operator/map"
import "rxjs/add/operator/do"
const uuidv4 = require("uuid/v4");

@Component()
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
        this.client = this.clientService.client.getClient();
    }

    create(program: ProgramDto): Promise<any> {
        return this.clientService.create(program, this.INDEX, this.TYPE, program.guid);
    }

    findAll(): Observable<ProgramDto[]> {
        return Observable.fromPromise( this.clientService.findAll(this.baseParams) )
    }

    index(program: ProgramDto) {
        program.created = Date.now();
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
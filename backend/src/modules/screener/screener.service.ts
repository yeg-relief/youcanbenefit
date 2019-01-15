import { Component } from '@nestjs/common';
import { ScreenerDto } from './screener.dto';
import { Client } from "elasticsearch";
import { ClientService } from "../db.elasticsearch/client.service"
import { Observable } from "rxjs/Observable";
import { ConstantsReadonly } from "../constants.readonly"
import "rxjs/add/observable/fromPromise"
import "rxjs/add/operator/map"

@Component()
export class ScreenerService {
    private readonly constants = new ConstantsReadonly();

    readonly INDEX = 'questions';
    readonly TYPE = 'screener';

    constructor(
        private readonly clientService: ClientService,
    ) { }

    update(data: ScreenerDto, id?: string): Observable<{[key: string]: boolean}> {
        data.created = Date.now();
        return Observable.fromPromise( this.clientService.index(data, this.INDEX, this.TYPE, id || this.constants.domain) );
    }

    getAll(): Observable<ScreenerDto[]> {
        return Observable.fromPromise( this.clientService.findAll({index: this.INDEX, type: this.TYPE}) )
    }

    getLatest(): Observable<ScreenerDto> {
        return this.getAll().map(screeners => {
            const largestCreatedNumber = Math.max(...screeners.map(screener => screener.created));
            return screeners.find(screener => screener.created === largestCreatedNumber)
        })
    }

    getByEnvironmentDomain(): Observable<ScreenerDto> {
        const baseParams = {
            index: this.INDEX,
            type: this.TYPE
        };

        return Observable.fromPromise( this.clientService.getById(baseParams, this.constants.domain) )
    }
}
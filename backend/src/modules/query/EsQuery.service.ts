import { Component } from '@nestjs/common';
import { EsQueryDto } from './EsQuery.dto';
import { ClientService } from "../db.elasticsearch/client.service"
import { Observable } from "rxjs/Observable";
import "rxjs/add/observable/fromPromise"
import "rxjs/add/operator/reduce"
import {SearchParams} from "elasticsearch";

@Component()
export class EsQueryService {
    private readonly INDEX = "master_screener";
    private readonly TYPE = "queries";
    private readonly baseParams = {
        index: this.INDEX,
        type: this.TYPE
    };

    constructor(
        private readonly clientService: ClientService,
    ) {}

    async create(query: EsQueryDto): Promise<boolean> {
        try {
            const res = await this.clientService.create(query, this.INDEX, this.TYPE, query.meta.id);
            return res.created;
        } catch (error) {
            console.error(error);
            return false
        }

    }

    async index(query: EsQueryDto): Promise<boolean> {
        return await this.clientService.index(query, this.INDEX, this.TYPE, query.meta.id);
    }

    findAll(): Observable<EsQueryDto[]> {
        return Observable.fromPromise(this.clientService.findAll(this.baseParams))
    }

    getByGuid(guid: string): Promise<EsQueryDto[]> {
        return this.clientService.client.search({
            ...this.baseParams,
            body: { "query": { match: { "meta.program_guid": guid } }
        }})
            .then(searchResponse => searchResponse.hits.hits.map(hit => hit._source))
            .then( sources => sources.map(source => new EsQueryDto(source)))
    }

    async mGetByGuid(guids: string[]): Promise<EsQueryDto[][]> {
        return Promise.all(guids.map(guid => this.getByGuid(guid)))
    }

    deleteByGuid(guid: string): any {
        return this.clientService.client.deleteByQuery({
            index: this.INDEX,
            type: this.TYPE,
            body: { query: { match: { "meta.program_guid": guid } } }
        })
    }

    deleteById(id: string): any {
        return this.clientService.delete(this.INDEX, this.TYPE, id)
    }
}
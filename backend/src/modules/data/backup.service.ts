import {Component} from '@nestjs/common';
import {ClientService} from '../db.elasticsearch/client.service';
import { Client } from "elasticsearch"
import {Schema} from './Schema';

@Component()
export class BackupService {
    private client: Client;
    private readonly PAGE_SIZE = 10000;

    constructor(private clientService: ClientService){
        this.client = this.clientService.client
    }

    async execute(): Promise<Object> {
        const requests = [
            this.client.search({
                index: Schema.programs.index,
                type: Schema.programs.type,
                size: this.PAGE_SIZE,
                body: { query: { match_all: {} } }
            }),

            this.client.indices.getMapping({
                index: Schema.programs.index,
                type: Schema.programs.type
            }),

            this.client.search({
                index: Schema.queries.index,
                type: Schema.queries.type,
                size: this.PAGE_SIZE,
                body: { query: { match_all: {} } }
            }),

            this.client.indices.getMapping({
                index: Schema.queries.index,
                type: Schema.queries.type
            }),

            this.client.search( {
                index: Schema.master_screener.index,
                type: Schema.master_screener.type,
                size: this.PAGE_SIZE,
                body: { query: { match_all: {} } }
            }),

            this.client.indices.getMapping({
                index: Schema.master_screener.index,
                type: Schema.master_screener.type
            }),
        ];

        const [
            programs,
            programMappings,
            queries,
            queryMappings,
            master_screener,
            screenerMappings
        ] = await Promise.all(requests);

        return {
            programs: this.filterSource(programs),
            queries:  this.filterSource(queries),
            screener: this.getRecentScreener(this.filterSource(master_screener)),
            programMappings,
            queryMappings,
            screenerMappings
        };
    }

    private filterSource(result): any[] {
        return result.hits.hits.map(h => h._source);
    }

    private getRecentScreener(results: any[]): any {
        const max = Math.max.apply(Math, results.map(screener => screener.created));
        return results.find(r => r.created  === max) || {}
    }
}
import { Injectable } from '@nestjs/common';
import { QuestionDto } from './question.dto';
import { Client } from "elasticsearch";
import { ClientService } from "../db.elasticsearch/client.service"
import { Observable } from "rxjs/Observable";
import "rxjs/add/observable/fromPromise";
import "rxjs/add/operator/pluck";
import "rxjs/add/operator/map";
import "rxjs/add/operator/reduce";
import { Schema } from '../data/schema'
import { EsQueryService } from '../query/EsQuery.service';
import { EsQueryDto } from '../query/EsQuery.dto';

@Injectable()
export class QuestionService {
    constructor(private readonly clientService: ClientService, private queryService: EsQueryService) {}

    get maxSize() {
        return { size: 10000 }
    }

    async updateQuestions(questions: QuestionDto[]) : Promise<boolean> {
        const updatedQueries = await this.queryService.findAll()
                    .map( queries => this.queryService.updateQueries(queries, questions))
                    .toPromise()
        await this.queryService.deleteIndex();
        await this.queryService.createIndex();
        const res = await this.queryService.putMappings(questions);
        await this.queryService.uploadQueries(updatedQueries);
        return res
    }

    getQuestions(): Observable<QuestionDto[]> {
        return Observable.fromPromise(this.clientService.client.search({
            index: Schema.master_screener.index,
            type: Schema.master_screener.type,
            ...this.maxSize,
            body: { query: { match_all: {} } }
        }))
            .map( searchResponse => searchResponse.hits.hits.map(h => h._source))
            .map( screenerData => screenerData[0]['questions'])
    }
}
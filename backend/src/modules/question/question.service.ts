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

@Injectable()
export class QuestionService {
    private client: Client;
    private readonly baseParams = {
        index: "master_screener",
        type: "queries"
    };

    constructor(private readonly clientService: ClientService) {
        this.client = this.clientService.client;
    }


    private uploadQueries(queries): Promise<any> {
        const _queries = this.uploadQueriesWithOverwrite(queries);
        return Promise.all(_queries)
    }

    private uploadQueriesWithOverwrite(queries): Promise<any>[] {
        return  queries.map( (query, i) => this.client.index( {
                    index: "master_screener",
                    type: "queries",
                    id: query['meta'].id,
                    body: {
                        query: query['query'],
                        meta: query['meta']
                    }
            }).catch(err => {
                console.log("\x1b[31m", 'ERROR: uploading queries');
                console.log(err);
                return new Error(err)
            })
        )
    }

    private updateQueries(queries, questionKeys: QuestionDto[]): any[] {
        const updatedQueries = []
        queries.forEach(query => {
            const conditions = query['query']['bool']['must'];
            const updatedConditions = [];
            conditions.forEach(condition => {
                let keyRemained = questionKeys.some( questionKey => {
                    return questionKey.id === Object.keys(condition[Object.keys(condition)[0]])[0]
                })
                if (keyRemained) {
                    updatedConditions.push(condition)
                }
            });
            const questionTexts = query['meta']['questionTexts']
            questionKeys.forEach( questionKey => {
                if (questionTexts.hasOwnProperty(questionKey.id)) {
                    questionTexts[questionKey.id] = questionKey.text
                }
            })
            updatedQueries.push({
                meta: {
                    program_guid: query['meta']['program_guid'],
                    id: query['meta']['id'],
                    questionTexts
                },
                query: {
                    bool: {
                        must: updatedConditions
                    }
                }
            })
            
        })
        return updatedQueries
    }

    private async backupQueries(questionKeys: QuestionDto[]) : Promise<any> {
        const indexExists = await this.client.indices.exists({ index:'master_screener' });

        const queriesRequest = await this.client.search({
            index: Schema.queries.index,
            type: Schema.queries.type,
            size: 10000,
            body: { query: { match_all: {} } }
        })

        const queries = queriesRequest.hits.hits.map(h => h._source)
        const updatedQueries = this.updateQueries(queries, questionKeys)
        
        if (indexExists) {
            await this.client.indices.delete({ index:'master_screener' })
        }
        return updatedQueries
    }

    async updateQuestions(questionKeys: QuestionDto[]) : Promise<any> {

        const updatedQueries = await this.backupQueries(questionKeys)

        const mapping = []
        questionKeys.forEach( questionKey => {
            mapping.push({[questionKey.id] : {type: questionKey.type}})
        })
        mapping.push({"query" : {type: "percolator"}})
        
        const normalizedMapping = mapping.reduce( (result, item) => {
            var key = Object.keys(item)[0]
            result[key] = item[key]
            return result
        }, {});

        await this.client.indices.create({ index: 'master_screener'});
        const masterScreenerPutMapping = await this.client.indices.putMapping({
            index: Schema.queries.index,
            type: Schema.queries.type,
            body: { properties: { ...normalizedMapping } }
        });

        await this.uploadQueries(updatedQueries)

        return masterScreenerPutMapping
    }

    getQuestions(): Observable<any> {
        return Observable.fromPromise(this.clientService.client.search({
            index: Schema.master_screener.index,
            type: Schema.master_screener.type,
            size: 10000,
            body: { query: { match_all: {} } }
        }))
            .map( searchResponse => searchResponse.hits.hits.map(h => h._source))
            .map( screenerData => screenerData[0]['questionKeys'])
    }
}

import { Injectable } from '@nestjs/common';
import { EsQueryDto } from './EsQuery.dto';
import { ClientService } from "../db.elasticsearch/client.service"
import { Observable } from "rxjs/Observable";
import "rxjs/add/observable/fromPromise"
import "rxjs/add/operator/reduce"
import {SearchParams} from "elasticsearch";
import { QuestionDto } from '../question/question.dto';

@Injectable()
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

    get maxSize() {
        return { size: 10000 }
    }

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
            ...this.maxSize,
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

    putMappings(questions: QuestionDto[]): Promise<boolean> {
        const mapping = {};
        questions.forEach( question => {
            mapping[question.id] = { type: question.type };
        })
        mapping['query'] = { type: "percolator" };
        return this.clientService.client.indices.putMapping({
            index: this.INDEX,
            type: this.TYPE,
            body: { properties: { ...mapping } }
        })
    }

    createIndex(): Promise<boolean> {
        return this.clientService.client.indices.create({ index: this.INDEX })
    }

    deleteIndex(): Promise<boolean> {
        return this.clientService.client.indices.delete({ index: this.INDEX })
    }

    updateQueries(queries: EsQueryDto[], newQuestions: QuestionDto[]): EsQueryDto[] {
        const updatedQueries: EsQueryDto[] = []
        queries.forEach(query => {
            const conditions = query['query']['bool']['must'];
            const updatedConditions = [];
            conditions.forEach(condition => {
                let questionRemained = newQuestions.some( question => {
                    return question.id === Object.keys(condition[Object.keys(condition)[0]])[0]
                })
                if (questionRemained) {
                    updatedConditions.push(condition)
                }
            });
            const questionTexts = query['meta']['questionTexts']
            newQuestions.forEach( question => {
                if (questionTexts.hasOwnProperty(question.id)) {
                    questionTexts[question.id] = question.text
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

    uploadQueries(queries): Promise<any> {
        const _queries = this.uploadQueriesWithOverwrite(queries);
        return Promise.all(_queries)
    }

    private uploadQueriesWithOverwrite(queries): Promise<any>[] {
        return  queries.map( query => this.clientService.client.index( {
                    index: this.INDEX,
                    type: this.TYPE,
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

    
}
import { Injectable } from '@nestjs/common'
import { ElasticsearchService } from "@nestjs/elasticsearch";

@Injectable()
export class ClientService {
    private _client: ElasticsearchService;

    constructor(esService: ElasticsearchService){
        this._client = esService;
    }

    public ping(): Promise<any> {
        let test = this._client.ping({});
        return this._client.ping({}).toPromise();
    }

    get client() {
        return this._client;
    }

    get matchAll() {
        return { body: { query: { match_all: {} } } }
    }

    get maxSize() {
        return { size: 10000 }
    }

    create(body: any, index: string, type: string, id?: string): Promise<any> {
        return this._client.create({
            index: index,
            type: type,
            id: id || null,
            body
        })
        .toPromise()
        .catch(err => {
            console.log(err);
            throw err;
        })
        .then(() => ({ created: true}) )
    }

    index(body: any, index: string, type: string, id?: string): Promise<any> {
        return this.client.index({
            index: index,
            type: type,
            id: id || null,
            body
        })
        .toPromise()
        .catch(err => {
            console.log(err);
            return err
        })
        .then((res: any) => {
            return { created: res.created || null, result: res.result}
        })
    }

    delete(index: string, type: string, id?: string): Promise<any> {
        return this.client.delete({
            index,
            type,
            id: id || null,
        })
        .toPromise()
        .catch(err => {
            console.log(err);
            return err
        })
        .then(() => ({ deleted: true}) )
    }

    async findAll(baseParams): Promise<any[]> {
        const params = {
            ...baseParams,
            ...this.matchAll,
            ...this.maxSize
        };

        const rawResponse = await this.client.search(params).toPromise();
        return (
            <any[]>rawResponse.hits.hits.map(r => r._source).map(source => source)
        );
    }

    async getById(baseParams, id: string): Promise<any> {
        const params = {
            ...baseParams,
            ...{
                id
            }
        };

        const rawResponse = await this.client.get(params).toPromise();
        return rawResponse ? rawResponse._source : null;
    }

    async mGetById(ids: string[], index: string, type: string): Promise<any[]> {
        const params = {
            index,
            body: {
                query: {
                    ids: {
                        type,
                        values: ids
                    }
                }
            }

        };

        const rawResponse = await this.client.search(params).toPromise();

        return (
            <any[]>rawResponse.hits.hits.map(r => r._source).map(source => source)
        );
    }
}
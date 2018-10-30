import { Component } from '@nestjs/common';
import { EsQueryDto } from "./EsQuery.dto";
import { EsQueryModel } from "./EsQuery.model";
import { ApplicationQueryModel } from "./ApplicationQuery.model";
import { ApplicationQueryDto } from "./ApplicationQuery.dto";
import { EsQueryService } from "./EsQuery.service";
import { Observable } from "rxjs/Observable";
import "rxjs/add/observable/fromPromise"
import "rxjs/add/operator/map";
import "rxjs/add/operator/mergeMap"
import "rxjs/add/operator/toArray"
import "rxjs/add/operator/let"

@Component()
export class ApplicationQueryService {
    constructor(private queryService: EsQueryService) {}

    async create(applicationDto: ApplicationQueryDto): Promise<boolean> {
        const model = new EsQueryModel(applicationDto);
        const esDto = model.buildEsQuery();

        try {
            return this.queryService.create(esDto)
        } catch (error) {
            console.error(error);
            return false;

        }

    }

    async index(applicationDto: ApplicationQueryDto): Promise<any> {
        const model = new EsQueryModel(applicationDto);
        const esDto = model.buildEsQuery();
        return this.queryService.index(esDto)
    }

    findAll(): Observable<ApplicationQueryDto[]> {
        return this.queryService.findAll()
            .let(this.arrayOfEsToApplication)
    }

    getByGuid(guid: string): Observable<ApplicationQueryDto[]> {
        return Observable.fromPromise(this.queryService.getByGuid(guid))
            .let(this.arrayOfEsToApplication)
    }

    mGetByGuid(guids: string[]): Observable<ApplicationQueryDto[]> {
        return Observable.fromPromise(this.queryService.mGetByGuid(guids))
            .mergeMap(x => x)
            .let(this.arrayOfEsToApplication)

    }

    deleteByGuid(guid: string): Observable<any> {
        return Observable.fromPromise(this.queryService.deleteByGuid(guid))
    }

    deleteById(id: string): Observable<any> {
        return Observable.fromPromise(this.queryService.deleteById(id))
    }

    private arrayOfEsToApplication(esQueries$: Observable<EsQueryDto[]>): Observable<ApplicationQueryDto[]> {
        return esQueries$
            .mergeMap(x => x)
            .map(esQuery => new ApplicationQueryModel(esQuery))
            .map(applicationQuery => applicationQuery.buildApplicationQuery())
            .toArray()
    }
}
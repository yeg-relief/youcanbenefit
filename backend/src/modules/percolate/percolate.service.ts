import { Component } from '@nestjs/common';
import { Client, SearchParams } from "elasticsearch";
import { ClientService } from "../db.elasticsearch/client.service"
import { Observable } from "rxjs/Observable";
import { ProgramDto } from "../Program/program.dto";
import { ProgramService } from "../Program/program.service";
const uniqBy = require("lodash.uniqby");
const get = require("lodash.get");
import "rxjs/add/observable/fromPromise"
import "rxjs/add/operator/map"
import "rxjs/add/operator/mergeMap"
import "rxjs/add/operator/do"
import {LogService} from "../log/log.service";

@Component()
export class PercolateService {
    private readonly client: Client;
    static readonly index = 'master_screener';
    static readonly field = 'query';
    static readonly document_type = 'queries';
    static readonly includes = 'meta.*';


    constructor(
        private readonly clientService: ClientService,
        private readonly programService: ProgramService,
        private readonly logService: LogService
    ) {
        this.client = this.clientService.client;
    }


    private percolateParams(data): SearchParams {
        return {
            index: PercolateService.index,
            size: this.clientService.maxSize.size,
            body: {
                query: {
                    percolate: {
                        field: PercolateService.field,
                        document_type: PercolateService.document_type,
                        document:   data
                    }
                },
                _source: {
                    includes: PercolateService.includes
                }
            }
        }
    }

    precolate(data): Observable<ProgramDto[]> {
        const params = this.percolateParams(data);

        try {
            this.logService.logFormSubmission(data)
        } catch(error) {
            console.error(error);
        }

        return Observable.fromPromise( this.client.search (params) )
            .map( res => uniqBy(res.hits.hits, "_source.meta.program_guid") )
            .map( res => res.map(searchHit => get(searchHit, "_source.meta.program_guid")) )
            .mergeMap( guids => this.programService.mGetByGuid(guids))
            .do( programs => {
                try {
                    this.logService.logProgramResults(programs)
                }catch (error) {
                    console.error(error)
                }
            })
    }

}
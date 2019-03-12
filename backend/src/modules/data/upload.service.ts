import {Injectable} from '@nestjs/common';
import { Client } from "elasticsearch"
import {ClientService} from '../db.elasticsearch/client.service';
import {Schema} from './Schema';

@Injectable()
export class UploadService {
    private client: Client;

    constructor(private clientService: ClientService){
        this.client = this.clientService.client;
    }

    async execute(data) {
        let screenerRes,
            programRes,
            queryRes,
            pageRes,
            programMappings,
            queryMappings,
            screenerMappings,
            pageMappings;

        const masterScreenerExists = await this.client.indices.exists({ index: Schema.queries.index});
        const questionsExists = await this.client.indices.exists({ index: Schema.master_screener.index});
        const programsExists = await this.client.indices.exists({ index: Schema.programs.index});
        const pagesExists = await this.client.indices.exists({ index: Schema.pages.index});

        if (masterScreenerExists) {
            await this.client.indices.delete({ index: Schema.queries.index});
        }
        await this.client.indices.create({ index: Schema.queries.index});
        if (data.queryMappings) {
            const normalizedMapping = this.normaliseMapping(
                data,
                Schema.queries.type,
                Schema.queries.index,
                'queryMappings'
            );
            queryMappings = await this.client.indices.putMapping({
                index: Schema.queries.index,
                type:  Schema.queries.type,
                body: { properties: { ...normalizedMapping } }
            })
        } else {
            console.dir(Object.keys(data));
            throw new Error("No queryMappings")
        }
        if (data.queries) {
            queryRes = await this.uploadQueries(data.queries)
        } else {
            throw new Error("No queries")
        }

        if (programsExists) {
            await this.client.indices.delete({ index: Schema.programs.index});
        }
        await this.client.indices.create({ index: Schema.programs.index});
        if (data.programMappings) {
            const normalizedMapping = this.normaliseMapping(
                data,
                Schema.programs.type,
                Schema.programs.index,
                'programMappings'
            );
            programMappings = await this.client.indices.putMapping({
                index: Schema.programs.index,
                type:  Schema.programs.type,
                body: { properties: { ...normalizedMapping } }
            })
        } else {
            throw new Error("No programMappings")
        }
        if (data.programs) {
            programRes = await this.uploadPrograms(data.programs)
        } else {
            throw new Error("No programs")
        }

        if (questionsExists) {
            await this.client.indices.delete({ index: Schema.master_screener.index});
        }
        await this.client.indices.create({ index: Schema.master_screener.index});
        if (data.screenerMappings) {
            const normalizedMapping = this.normaliseMapping(
                data,
                Schema.master_screener.type,
                Schema.master_screener.index,
                'screenerMappings'
            );
            screenerMappings = await this.client.indices.putMapping({
                index: Schema.master_screener.index,
                type:  Schema.master_screener.type,
                body: { properties: { ...normalizedMapping } }
            })
        } else {
            throw new Error("No screenerMappings")
        }
        if (data.screener) {
            screenerRes = await this.uploadScreener(data.screener)
        } else {
            throw new Error("No screener")
        }

        if (pagesExists) {
            await this.client.indices.delete({ index: Schema.pages.index});
        }
        await this.client.indices.create({ index: Schema.pages.index});
        if (data.pageMappings) {
            const normalizedMapping = this.normaliseMapping(
                data,
                Schema.pages.type,
                Schema.pages.index,
                'pageMappings'
            );
            pageMappings = await this.client.indices.putMapping({
                index: Schema.programs.index,
                type:  Schema.programs.type,
                body: { properties: { ...normalizedMapping } }
            })
        } else {
            throw new Error("No pageMappings")
        }
        if (data.pages) {
            pageRes = await this.uploadPages(data.pages)
        } else {
            throw new Error("No pages")
        }

        return {
            screenerRes,
            programRes,
            queryRes,
            pageRes,
            queryMappings,
            programMappings,
            screenerMappings,
            pageMappings
        }
    }

    private uploadScreener(screener): Promise<any> {
        screener['created'] = Date.now();

        return this.client.index({
            index: Schema.master_screener.index,
            type: Schema.master_screener.type,
            body: screener
        }).catch(err => {
            console.log("\x1b[31m", 'ERROR: uploading screener');
            console.log(err);
            process.exit(100);
            return new Error(err)
        })
    }

    private uploadPrograms(programs): Promise<any> {
        return Promise.all(this.uploadProgramsWithOverwrite(programs))
    }

    private uploadProgramsWithOverwrite(programs): Promise<any>[] {
        return programs.map(program => this.uploadProgram(program))
    }

    private uploadProgram(program): Promise<any> {
        return this.client.index({
            index: Schema.programs.index,
            type: Schema.programs.type,
            id: program.guid,
            body: program
        }).catch(err => {
            console.log("\x1b[31m", 'ERROR: uploading program');
            console.log(err);
            process.exit(101);
            return new Error(err)
        })
    }

    private uploadQueries(queries): Promise<any> {
        const _queries = this.uploadQueriesWithOverwrite(queries);
        return Promise.all(_queries)
    }

    private uploadQueriesWithOverwrite(queries): Promise<any>[] {
        return  queries.map( (query, i) => this.client.index( {
                    index: Schema.queries.index,
                    type: Schema.queries.type,
                    id: query['meta'].id,
                    body: {
                        query: query['query'],
                        meta: query['meta']
                    }
            }).catch(err => {
                console.log("\x1b[31m", 'ERROR: uploading queries');
                console.log(err);
                process.exit(102);
                return new Error(err)
            })
        )
    }

    private uploadPages(pages): Promise<any> {
        const _pages = this.uploadPagesWithOverwrite(pages);
        return Promise.all(_pages)
    }

    private uploadPagesWithOverwrite(pages): Promise<any>[] {
        return  pages.map( page => this.client.index( {
                    index: Schema.pages.index,
                    type: Schema.pages.type,
                    id: page.title,
                    body: page
            }).catch(err => {
                console.log("\x1b[31m", 'ERROR: uploading pages');
                console.log(err);
                process.exit(102);
                return new Error(err)
            })
        )
    }

    normaliseMapping(mappings, type, index, container) {
        let val;

        if (mappings[container].mappings) {
            val = mappings[container].mappings[type].properties;
        } else if (mappings[container][index]) {
            val = mappings[container][index].mappings[type].properties
        } else {
            throw new Error("FOILED AGAIN!");
        }

        return val;

    }
}
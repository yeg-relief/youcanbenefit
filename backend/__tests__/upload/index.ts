import { Schema } from "../schema"

export class Uploader {

    constructor(
        private client: any,
        private overwrite: boolean,
        private data: any
    ) {}

    async execute() {
        let screenerRes, programRes, queryRes;
        const returnNull = _ => null;


        if (this.data.queries) {
            queryRes = await this.uploadQueries().catch(returnNull)
        }


        if (this.data.screener) {
            screenerRes = await this.uploadScreener().catch(returnNull)
        }

        if (this.data.programs) {
            programRes = await this.uploadPrograms().catch(returnNull)
        }

        return {
            screenerRes,
            programRes,
            queryRes
        }
    }

    private uploadScreener(): Promise<any> {
        this.data.screener['created'] = Date.now();

        return this.client.index({
            index: Schema.master_screener.index,
            type: Schema.master_screener.type,
            body: this.data.screener
        }).catch(err => {
            console.log("\x1b[31m", 'ERROR: uploading screener');
            console.log(err);
            process.exit(100);
            return new Error(err)
        })
    }

    private uploadPrograms(): Promise<any> {
        if (this.overwrite) {
            return Promise.all(this.uploadProgramsWithOverwrite())
        }

        return Promise.all(this.uploadProgramsWithoutOverwrite())
    }

    private uploadProgramsWithOverwrite(): Promise<any>[] {
        return this.data.programs.map(program => this.uploadProgram(program))
    }

    private uploadProgramsWithoutOverwrite(): Promise<any>[] {
        return this.data.programs.map(p => this.programExists(p).then(([exists, program]) => {
            if (exists) return false;

            return this.uploadProgram(program)
        }))
    }

    private programExists(program: any): Promise<any[]> {
        return this.client.exists({
            index: Schema.programs.index,
            type: Schema.programs.type,
            id: program.guid,
        })
            .then((exists: boolean) => [exists, program])

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

    private uploadQueries(): Promise<any> {
        const queries = this.uploadQueriesWithOverwrite();
        //console.log(queries);

        return Promise.all(queries)
    }

    private uploadQueriesWithoutOverwrite(): Promise<any>[] {
        return this.data.queries.map(q => this.queryExists(q).then(([exists, query]) => {
            if (exists) return false;

            return this.uploadProgram(query)
        }))
    }

    private uploadQueriesWithOverwrite(): Promise<any>[] {



        return this.data.queries.map( (query, i) => this.client.index( {
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

    private queryExists(query: any): Promise<any[]> {
        return this.client.exists({
            index: Schema.programs.index,
            type: Schema.programs.type,
            id: query.meta ? query.meta.id : 'no meta this is bad',
        })
            .then((exists: boolean) => [exists, query])
    }

    async createIndex(index: string, body?: {[key: string]: any}): Promise<any> {
        const indexExists = await this.client.indices.exists({ index });

        if (indexExists && this.overwrite) {
            await this.client.indices.delete({ index })
        } else if (indexExists && !this.overwrite) {
            return false
        }

        return this.client.indices.create({ index, body: body || null })
            .catch(err => {
                console.log("\x1b[31m", err);
                process.exit(69);
                return Error(err)
            })
    }
}
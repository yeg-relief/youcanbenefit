import { Schema } from "../schema"
import { Uploader } from "../upload"
import { Client } from "elasticsearch"


export class Seeder {
    private uploader: Uploader;
    private client: any;

    constructor(
        private data: any,
        private mappings: any,
        private overwrite: boolean = true
    ) {
        this.client = new Client({host: "http://localhost:9400"});
        this.uploader = new Uploader(this.client, overwrite, data);
    }

    async execute() {
        await Promise.all([
            await this.createIndex(
                Schema.queries.index,
                Schema.queries.type,
                this.normaliseData(this.mappings, 'queries','master_screener' ,'queryMappings', )
            ),
            await this.createIndex(
                Schema.programs.index,
                Schema.programs.type,
                this.normaliseData(this.mappings, 'user_facing', 'programs' , 'programMappings')
            ),
            await this.createIndex(
                Schema.master_screener.index,
                Schema.master_screener.type,
                this.normaliseData(this.mappings, 'screener', 'questions', 'screenerMappings')
            ),

        ]).catch(e => {
            console.error(e);
            process.exit(1);
        });

        return await this.uploader.execute();
    }

    // data coming through run.ts is different than Stream#execute
    normaliseData(mappings, type, index, container) {
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


    async createIndex(index: string, type: string,  properties: {[key: string]: any}): Promise<any> {
        const indexExists = await this.client.indices.exists({ index });


        if (indexExists && this.overwrite) {
            await this.client.indices.delete({ index })
        } else if (indexExists && !this.overwrite) {
            return false
        }

        return this.client.indices.create({
            index,
        })
            .catch(err => {
                console.log("\x1b[31m", err);
                process.exit(69);
                return Error(err)
            })
            .then( () => this.client.indices.putMapping({
                index,
                type,
                body: {
                    properties
                }
            }))
    }
}
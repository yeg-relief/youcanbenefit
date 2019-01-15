import { Component } from '@nestjs/common';
import { Client } from "elasticsearch"
import { ClientService } from '../db.elasticsearch/client.service';

@Component()
export class InitService {
    private client: Client;

    constructor(private clientService: ClientService){
        this.client = this.clientService.client;
    }

    async hasBeenInitialized(): Promise<boolean> {
        const masterScreenerExists = await this.client.indices.exists({ index: 'master_screener'});
        const questionsExists = await this.client.indices.exists({ index: 'questions'});
        const programsExists = await this.client.indices.exists({ index: 'programs'});

        return masterScreenerExists && questionsExists && programsExists;
    }


    async initialize(force = false): Promise<any> {
        const masterScreenerExists = await this.client.indices.exists({ index: 'master_screener'});
        const questionsExists = await this.client.indices.exists({ index: 'questions'});
        const programsExists = await this.client.indices.exists({ index: 'programs'});

        const hasBeenInitialized = masterScreenerExists && questionsExists && programsExists;


        if (hasBeenInitialized && !force) {
            throw new Error("Database has already been initialized.");
        }

        if (masterScreenerExists) {
            await this.client.indices.delete({ index: 'master_screener'});
        }

        if (questionsExists) {
            await this.client.indices.delete({ index: 'questions'});
        }

        if (programsExists) {
            await this.client.indices.delete({ index: 'programs'});
        }

        await this.client.indices.create({ index: 'master_screener'});
        const masterScreenerPutMapping = await this.client.indices.putMapping({
            index: 'master_screener',
            type: 'queries',
            body: { properties: { ...PERCOLATOR_MAPPING } }
        });

        await this.client.indices.create({ index: 'questions'});
        const questionScreenerMapping = await this.client.indices.putMapping({
            index: 'questions',
            type: 'screener',
            body: { properties: { ...SCREENER_MAPPING } }
        });

        await this.client.indices.create({ index: 'programs'});
        const programsMapping = await this.client.indices.putMapping({
            index: 'programs',
            type: 'user_facing',
            body: { properties: { ...PROGRAM_MAPPING } }
        });

        return [
            [ masterScreenerExists, masterScreenerPutMapping],
            [ questionsExists, questionScreenerMapping ],
            [ programsExists, programsMapping ]
        ]
    }
}

const PERCOLATOR_MAPPING = {
    "query": { "type": "percolator" },
    "meta":{
        "properties":{
            "id":{"type":"text","fields":{"keyword":{"type":"keyword","ignore_above":256}}},
            "program_guid":{"type":"text","fields":{"keyword":{"type":"keyword","ignore_above":256}}}
        }
    }
};

const PROGRAM_MAPPING = {
    "created":{"type":"date"},
    "description":{"type":"text", "fields":{"keyword":{"type":"keyword","ignore_above":256}}},
    "detailLinks":{"type":"text","fields":{"keyword":{"type":"keyword","ignore_above":256}}},
    "details":{"type":"text","fields":{"keyword":{"type":"keyword","ignore_above":256}}},
    "externalLink":{"type":"text"},
    "guid":{"type":"text","fields":{"keyword":{"type":"keyword","ignore_above":256}}},
    "tags":{"type":"keyword"},
    "title":{"type":"text"}
};

const SCREENER_MAPPING = {
    "conditionalQuestions":{
        "properties":{
            "controlType":{"type":"text","fields":{"keyword":{"type":"keyword","ignore_above":256}}},
            "expandable":{"type":"boolean"},
            "id":{"type":"text","fields":{"keyword":{"type":"keyword","ignore_above":256}}},
            "index":{"type":"long"},
            "key":{"type":"text","fields":{"keyword":{"type":"keyword","ignore_above":256}}},
            "label":{"type":"text","fields":{"keyword":{"type":"keyword","ignore_above":256}}},
            "multiSelectOptions":{
                "properties":{
                    "key":{
                        "properties":{
                            "name":{"type":"text","fields":{"keyword":{"type":"keyword","ignore_above":256}}},
                            "type":{"type":"text","fields":{"keyword":{"type":"keyword","ignore_above":256}}}
                        }
                    },
                    "text":{"type":"text","fields":{"keyword":{"type":"keyword","ignore_above":256}}}}},
            "options":{"type":"long"}}},
    "created":{"type":"long"},
    "questions":{
        "properties":{
            "conditionalQuestions":{"type":"text","fields":{"keyword":{"type":"keyword","ignore_above":256}}},
            "controlType":{"type":"text","fields":{"keyword":{"type":"keyword","ignore_above":256}}},
            "expandable":{"type":"boolean"},
            "id":{"type":"text","fields":{"keyword":{"type":"keyword","ignore_above":256}}},
            "index":{"type":"long"},
            "key":{"type":"text", "fields":{"keyword":{"type":"keyword","ignore_above":256}}},
            "label":{"type":"text","fields":{"keyword":{"type":"keyword","ignore_above":256}}},
            "multiSelectOptions":{
                "properties":{
                    "key":{
                        "properties":{
                            "name":{"type":"text","fields":{"keyword":{"type":"keyword","ignore_above":256}}},
                            "type":{"type":"text","fields":{"keyword":{"type":"keyword","ignore_above":256}}}}
                    },
                    "text":{"type":"text","fields":{"keyword":{"type":"keyword","ignore_above":256}}}
                }
            }
        }
    }
};
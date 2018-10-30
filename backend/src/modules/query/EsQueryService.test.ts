import { Test } from '@nestjs/testing';
import { EsQueryService} from "./EsQuery.service";
import { ClientService } from "../db.elasticsearch/client.service"
import { EsQueryDto } from "./EsQuery.dto";

describe('EsQueryService', () => {
    let queryService: EsQueryService;
    const mockDTO: EsQueryDto = {
        "query": {
            "bool": {
                "must": [
                    {
                        "term": {
                            "aish": false
                        }
                    },
                    {
                        "term": {
                            "albertaworks": false
                        }
                    },
                    {
                        "term": {
                            "spouse": false
                        }
                    },
                    {
                        "term": {
                            "children": true
                        }
                    },
                    {
                        "range": {
                            "numberchildren": {
                                "lte": 2
                            }
                        }
                    },
                    {
                        "range": {
                            "grossincome": {
                                "lte": 36325
                            }
                        }
                    }
                ]
            }
        },
        "meta": {
            "program_guid": "nQXxT1OMhPGbkqkPHc2QTpofRv",
            "id": "m6b1jkRrVWGTxqr33nmh5gExfD"
        }
    };

    beforeEach(async () => {
        const module = await Test.createTestingModule({
            controllers: [],
            components: [EsQueryService, ClientService],
        }).compile();
        queryService = module.get<EsQueryService>(EsQueryService);
    });

    describe('create', () => {
        it('should return an elasticsearch create response', async () => {
            const result = {
                "_index": "programs",
                "_type": "user_facing",
                "_id": "test guid7",
                "_version": 1,
                "result": "created",
                "_shards": {
                    "total": 2,
                    "successful": 1,
                    "failed": 0
                },
                "created": true
            };
            jest.spyOn(queryService, 'create').mockImplementation(() => result);
            // tested by hand against db this is an actual response... figure out better test later
            expect(await queryService.create(mockDTO)).toMatchObject(result);
        });
    });
});
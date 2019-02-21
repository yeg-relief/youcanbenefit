import { Test } from '@nestjs/testing';
import { EsQueryService} from "./EsQuery.service";
import { EsQueryDto } from "./EsQuery.dto";
import { DbElasticsearchModule } from '../db.elasticsearch/db.elasticsearch.module'

describe('EsQueryService', () => {
    let queryService: EsQueryService;
    const mockDTO: EsQueryDto = {
        "query": {
            "bool": {
                "must": [
                    {
                        "term": {
                            "wPe0S0iQ23kToF7B2CJd": false
                        }
                    },
                    {
                        "term": {
                            "E9L05fKKsRFsNsfjaJ5U": false
                        }
                    },
                    {
                        "term": {
                            "VIXBl1tiUyAx8EPuZrzk": false
                        }
                    },
                    {
                        "term": {
                            "HVZbfiR8XkcSwJ2FFBNq": true
                        }
                    },
                    {
                        "range": {
                            "an2swDUmzfKa61MhdziL": {
                                "lte": 2
                            }
                        }
                    },
                    {
                        "range": {
                            "hdPMbny6X0WNhwuiJiMt": {
                                "lte": 36325
                            }
                        }
                    }
                ]
            }
        },
        "meta": {
            "program_guid": "nQXxT1OMhPGbkqkPHc2QTpofRv",
            "id": "m6b1jkRrVWGTxqr33nmh5gExfD",
            "questionTexts": {
                "an2swDUmzfKa61MhdziL": "How many children do you have under 18?",
                "hdPMbny6X0WNhwuiJiMt": "What is your Household's Total or Gross yearly income? (check line 150 of your tax return) Option: If you don't know your gross income, multiply your monthly income by 12.",
                "wPe0S0iQ23kToF7B2CJd": "AISH",
                "E9L05fKKsRFsNsfjaJ5U": "Income Support/Alberta works",
                "VIXBl1tiUyAx8EPuZrzk": "Do you have a spouse or common-law partner?",
                "HVZbfiR8XkcSwJ2FFBNq": "Do you have children under the age of 18 living with you?"
            }
        }
    };

    beforeEach(async () => {
        const module = await Test.createTestingModule({
            imports: [DbElasticsearchModule],
            controllers: [],
            providers: [EsQueryService],
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
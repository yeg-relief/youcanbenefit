import { EsQueryModel } from "./EsQuery.model";
import { EsQueryDto } from "./EsQuery.dto";
import { ApplicationQueryDto } from "./ApplicationQuery.dto";

describe('EsQueryModel', () => {
    const mockDTO: ApplicationQueryDto = {
        guid: "guid",
        id: "id",
        conditions: [
            {
                key: {
                    name: "aish",
                    type: "boolean",
                },
                value: false,
                qualifier: null
            },
            {
                key: {
                    name: "numberchildren",
                    type: "number"
                },
                qualifier: "lessThanOrEqual",
                value: 2
            },
            {
                key: {
                    name: "number",
                    type: "number"
                },
                qualifier: "equal",
                value: 2
            }
        ]
    };
    const model = new EsQueryModel(mockDTO);


    describe('convert to elastic search query', () => {
        it('should return an EsQueryDto', () => {
            const result: EsQueryDto = {
                meta: {
                    program_guid: "guid",
                    id: "id"
                },
                query: {
                    bool: {
                        must: [
                            {
                                "term": {
                                    "aish": false
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
                                "term": {
                                    "number": 2
                                }
                            }
                        ]
                    }
                }
            };
            expect( model.buildEsQuery()).toMatchObject(result);
        });
    });
});
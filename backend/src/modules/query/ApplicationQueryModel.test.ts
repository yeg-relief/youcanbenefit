import { ApplicationQueryModel } from "./ApplicationQuery.model";
import {EsQueryDto} from "./EsQuery.dto";

describe("ApplicationQueryModel", () => {
    const data: EsQueryDto = {
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

    it("can convert the elasticsearch model to the application model", () => {
        const applicationModel = new ApplicationQueryModel(data);
        expect(applicationModel.buildApplicationQuery()).toMatchObject({
            guid: "guid",
            id: "id",
            conditions: [
                {
                    key: {
                        name: "aish",
                        type: "boolean",
                    },
                    value: false
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
        })
    })
});
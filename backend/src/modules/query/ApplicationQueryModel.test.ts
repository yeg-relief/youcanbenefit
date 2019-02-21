import { ApplicationQueryModel } from "./ApplicationQuery.model";
import {EsQueryDto} from "./EsQuery.dto";

describe("ApplicationQueryModel", () => {
    const data: EsQueryDto = {
        meta: {
            program_guid: "guid",
            id: "id",
            questionTexts: {
                an2swDUmzfKa61MhdziL: "How many children do you have under 18?",
                hdPMbny6X0WNhwuiJiMt: "What is your Household's Total or Gross yearly income? (check line 150 of your tax return) Option: If you don't know your gross income, multiply your monthly income by 12.",
                wPe0S0iQ23kToF7B2CJd: "AISH"
            }
        },
        query: {
            bool: {
                must: [
                    {
                        "term": {
                            "wPe0S0iQ23kToF7B2CJd": false
                        }
                    },
                    {
                        "term": {
                            "an2swDUmzfKa61MhdziL": 2
                        }
                    },
                    {
                        "range": {
                            "hdPMbny6X0WNhwuiJiMt": {
                                "lte": 30000
                            }
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
                    question: {
                        text: "AISH",
                        id: "wPe0S0iQ23kToF7B2CJd",
                        type: "boolean",
                    },
                    value: false,
                    qualifier: "equal"
                },
                {
                    question: {
                        text: "How many children do you have under 18?",
                        id: "an2swDUmzfKa61MhdziL",
                        type: "number"
                    },
                    qualifier: "equal",
                    value: 2
                },
                {
                    question: {
                        text: "What is your Household's Total or Gross yearly income? (check line 150 of your tax return) Option: If you don't know your gross income, multiply your monthly income by 12.",
                        id: "hdPMbny6X0WNhwuiJiMt",
                        type: "number"
                    },
                    qualifier: "lessThanOrEqual",
                    value: 30000
                }
            ]
        })
    })
});
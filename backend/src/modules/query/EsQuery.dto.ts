/*
{
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
  },


 */

type Condition =
    {[key: string]: {[key:string]: boolean | number }} |
    {[key:string]: {[key:string]: {[key:string]: number } } }

interface bool {
    readonly must: Condition[]
}

interface Meta {
  program_guid: string;
  id: string;
  questionTexts : {[key: string] : string};
}

export class EsQueryDto {
    readonly query: {[key: string]: bool};
    readonly meta: Meta;

    constructor(data) {
        Object.assign(this, data);

        if (!this.hasOwnProperty('query') || typeof this.query !== "object") {
            throw new Error("bad QueryDto");
        }
    }
}
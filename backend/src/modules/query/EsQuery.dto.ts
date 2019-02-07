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

type Meta = {[key: string]: string}

interface bool {
    readonly must: Condition[]
}

export class EsQueryDto {
    readonly query: {[key: string]: bool};
    readonly meta: Meta;
    readonly questionTexts: {[key: string]: string};

    constructor(data) {
        Object.assign(this, data);

        if (!this.hasOwnProperty('query') || typeof this.query !== "object") {
            throw new Error("bad QueryDto");
        }
    }
}
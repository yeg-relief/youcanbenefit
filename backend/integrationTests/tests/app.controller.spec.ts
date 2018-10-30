const request = require("supertest");
import { instance } from "../../src/server"

describe("/", () => {
    it("GET should return 'hello world'", done => {
        return request(instance)
            .get("/")
            .expect(200)
            .end( (err, response) => {
                if (err) throw err;
                expect(response.text).toMatchSnapshot();
                done();
            });
    });
});

describe("/api", () => {

    it("/GET screener -- returns latest screener", done => {
        return request(instance)
            .get("/api/screener/")
            .expect(200)
            .end( (err, res) => {
                if (err) throw err;

                delete res.body.created;

                expect(res.body).toMatchSnapshot();
                done();
            })
    });

    it("/GET programs -- returns all programs", done => {
        return request(instance)
            .get("/api/program/")
            .expect(200)
            .end( (err, res) => {
                if (err) throw err;

                const data = res.body.map( program => {
                    delete program.created;
                    return program;
                }).sort( (a, b) => a.title.localeCompare(b.title));

                expect(data).toMatchSnapshot();
                done();
            })
    });

    it("/GET:guid -- returns the specific program", done => {
        return request(instance)
            .get("/api/program/GiufEa3ziFwfBEgkjI2gIlfNkk")
            .expect(200)
            .end( (err, res) => {
                if (err) throw err;

                delete res.body.created;

                expect(res.body).toMatchSnapshot();
                done();
            })
    });

    it("POST /notification -- returns programs", done => {
        /*
        {"query":{"bool":{"must":[{"term":{"aish":false}},{"term":{"albertaworks":false}},
        {"term":{"spouse":false}},{"term":{"children":true}},{"range":{"numberchildren":{"lte":2}}},
        {"range":{"grossincome":{"lte":36325}}}]}},
        "meta":{"program_guid":"nQXxT1OMhPGbkqkPHc2QTpofRv","id":"m6b1jkRrVWGTxqr33nmh5gExfD"}}

         */

        const data = {
            "aish": false,
            "albertaworks": false,
            "spouse": false,
            "children": true,
            "numberchildren": 1,
            "grossincome": 10000
        };

        return request(instance)
            .post("/api/notification")
            .set('Content-Type', 'application/json')
            .send(data)
            .expect(201)
            .end( (err, response) => {
                if (err) throw err;

                const data = response.body.map( program => {
                    delete program.created;
                    return program;
                }).sort( (a, b) => a.title.localeCompare(b.title));

                expect(data).toMatchSnapshot();
                done()
            })
    })

});

describe("/protected", () => {

    describe("/login", () => {
       it("POST /login will return { created: true }, authentication is handled by reverse proxy", done => {
            return request(instance)
                .get("/protected/login/")
                .expect(200)
                .end( (err, response) => {
                    if (err) throw err;

                    expect(response.body).toMatchSnapshot();
                    done();
                })
       })
    });



    describe("/program -- CRUD with program datastructures", () => {

        it(" GET /program will return all programs and their queries", done => {
            return request(instance)
                .get("/protected/program/")
                .expect(200)
                .end( (err, response) => {
                    if (err) throw err;

                    const extractedProperties = response.body.map( applicationProgramDto => applicationProgramDto.guid);
                    extractedProperties.sort( (a, b) => a.localeCompare(b));

                    expect(extractedProperties).toMatchSnapshot();
                    done();
                })


        });

        it("GET /program/:guid will return a single program and it's queries", done => {
            return request(instance)
                .get("/protected/program/hp5mupqcVY8ZMiKg7Q91Uoi4Wf")
                .expect(200)
                .end( (err, response) => {
                    if (err)  {
                        console.error(err);
                        throw err;
                    }

                    const applicationProgramDto = response.body;

                    const extractedProps = {
                        guid: applicationProgramDto.guid,
                        user: applicationProgramDto.user,
                        queryIDs: applicationProgramDto.application.map(query => query.id)
                    };

                    extractedProps.queryIDs.sort( (a, b) => a.localeCompare(b));
                    expect(applicationProgramDto.application.some(query => query.guid !== extractedProps.guid)).toBe(false);
                    expect(applicationProgramDto.application.length).toBe(10);
                    done();
                })
        });


        describe("POST /program", () => {
            const guid = "fake_guid";
            const id = "fake_id";
            const data =  {
                "user": {
                    "created": 0,
                    "description": "test POST /protected/program/",
                    "details": "test POST /protected/program/",
                    "externalLink": "test POST /protected/program/",
                    "guid": guid,
                    "tags": [
                        "test POST /protected/program/"
                    ],
                    "title": "test POST /protected/program/"
                },
                "guid": guid,
                "application": [
                    {
                        "guid": guid,
                        "id": id,
                        "conditions": [
                            {
                                "key": {
                                    "name": "empoyment",
                                    "type": "boolean"
                                },
                                "qualifier": "equal",
                                "value": true
                            }
                        ]
                    }
                ]
            };

            it("will create a new program and the queries", done => {
                return request(instance)
                    .post("/protected/program/")
                    .set('Content-Type', 'application/json')
                    .send(data)
                    .expect(201)
                    .end( (err, response) => {
                        if (err)  {
                            console.error(err);
                            throw err;
                        }
                        expect(response.body).toMatchSnapshot();
                        done();
                    })

            });
        });


        describe("PUT /program", () => {
            // copy+paste of data above
            const guid = "fake_guid";
            const id = "fake_id";
            const data =  {
                "user": {
                    "created": 0,
                    "description": "test POST /protected/program/ updated!!!",
                    "details": "test POST /protected/program/",
                    "externalLink": "test POST /protected/program/",
                    "guid": guid,
                    "tags": [
                        "test POST /protected/program/"
                    ],
                    "title": "test POST /protected/program/"
                },
                "guid": guid,
                "application": [
                    {
                        "guid": guid,
                        "id": id,
                        "conditions": [
                            {
                                "key": {
                                    "name": "empoyment",
                                    "type": "boolean"
                                },
                                "qualifier": "equal",
                                "value": true
                            },
                            {
                                "key": {
                                    "name": "age",
                                    "type": "number"
                                },
                                "qualifier": "lessThanOrEqual",
                                "value": 18
                            }
                        ]
                    }
                ]
            };


            it("will update a program data", done => {
                return request(instance)
                    .put("/protected/program")
                    .set('Content-Type', 'application/json')
                    .send(data)
                    .expect(200)
                    .end( (err, res) => {
                        if (err) throw err;

                        expect(res.body).toMatchSnapshot();
                        done();
                    })
            });
        });

        describe("DELETE /program/", () => {
            it("will delete a program and all it's queries", done => {
                return request(instance)
                    .delete("/protected/program/GiufEa3ziFwfBEgkjI2gIlfNkk") // delete "Edmonton Public Library Card"
                    .expect(200)
                    .end( (err, res) => {
                        if (err) throw err;
                        const [ programResponse, queryResponse ] = res.body;
                        expect( programResponse.deleted).toEqual(true);
                        expect( queryResponse.deleted).toEqual(1);
                        done();
                    })
            })
        })
    });

    describe("/query can delete, create or update queries", () => {
        it("can delete a query", done => {
            return request(instance)
                .delete("/protected/query/XsVRvsZeLOLgQhqZLwiLXaHFQk") // delete query from "Optical and Dental Assistance for Seniors"
                .expect(200)
                .end( (err, res) => {
                    if (err) throw err;

                    expect(res.body.deleted).toBe(true);
                    expect(res.body.found).not.toEqual(null);

                    expect(res.body).toMatchSnapshot();
                    done();
                })
        });


        it("can post a new query", done => {
            const data = {
                guid: "fake_guid_2",
                query: {
                    guid: "fake_guid_2",
                    id: "fake_query_id_1",
                    conditions: [
                        {
                            "key": {
                                "name": "empoyment",
                                "type": "boolean"
                            },
                            "qualifier": "equal",
                            "value": true
                        },
                        {
                            "key": {
                                "name": "age",
                                "type": "number"
                            },
                            "qualifier": "lessThanOrEqual",
                            "value": 18
                        }
                    ]
                }
            };

            return request(instance)
                .post("/protected/query")
                .set('Content-Type', 'application/json')
                .send(data)
                .expect(201)
                .end( (err, res) => {
                    if (err) throw err;

                    expect(res.body.created).toEqual(null);
                    expect(res.body.result).toEqual('created');
                    expect(res.body).toMatchSnapshot();
                    done();
                })
        });

        it("can update an existing query", done => {
            const data = {
                guid: "fake_guid_2",
                query: {
                    guid: "fake_guid_2",
                    id: "fake_query_id_1",
                    conditions: [
                        {
                            "key": {
                                "name": "empoyment",
                                "type": "boolean"
                            },
                            "qualifier": "equal",
                            "value": true
                        },
                        {
                            "key": {
                                "name": "age",
                                "type": "number"
                            },
                            "qualifier": "lessThanOrEqual",
                            "value": 18
                        },
                        {
                            "key": {
                                "name": "aish",
                                "type": "boolean"
                            },
                            "qualifier": "equal",
                            "value": true
                        }
                    ]
                }
            };


            return request(instance)
                .post("/protected/query")
                .set('Content-Type', 'application/json')
                .send(data)
                .expect(201)
                .end( (err, res) => {
                    if (err) throw err;

                    expect(res.body.created).toEqual(null);
                    expect(res.body.result).toEqual('updated');
                    expect(res.body).toMatchSnapshot();
                    done();
                })
        })


    });

    describe("/program-description/, can update a user facing program information", () => {
        it("can update an existing program", done => {
            const data = {
                created: 1,
                description: "a program",
                details: "a new detail",
                externalLink: "http://website.com",
                guid: "GiufEa3ziFwfBEgkjI2gIlfNkk", // update Edmonton Library Card
                tags: ["tag1"],
                title: "updated title",
            };


            return request(instance)
                .put("/protected/program-description/")
                .set('Content-Type', 'application/json')
                .send(data)
                .expect(200)
                .end( (err, res) => {
                    if (err) throw err;

                    expect(res.body.created).toEqual(null);
                    expect(res.body.result).toEqual("created");
                    expect(res.body).toMatchSnapshot();
                    done();
                })
        })
    });

    describe("/key/", () => {
        it("can get all keys", done => {
            return request(instance)
                .get("/protected/key/")
                .expect(200)
                .end( (err, res) => {
                    if (err) throw err;

                    expect(res.body).toMatchSnapshot();
                    done();
                })
        });

        it("can create a new key", done => {
            const data = {
                "test_key": {
                    type: "boolean"
                }
            };


            return request(instance)
               .post("/protected/key/")
               .set('Content-Type', 'application/json')
               .send(data)
               .expect(201)
               .end( (err, res) => {
                   if (err) throw err;

                   expect(res.body).toMatchSnapshot();
                   done();
               })
        })
    });

    describe("/screener/", () => {
        it("can get the screener with keys", done => {
            return request(instance)
                .get("/protected/screener/")
                .expect(200)
                .end( (err, res) => {
                    if (err) throw err;

                    delete res.body.created;

                    expect(res.body).toMatchSnapshot();
                    done();
                })
        });

        it("can post a new screener", done => {
           const data = {
               questions: [ "imagine there were questions here" ]
           };

            return request(instance)
                .post("/protected/screener/")
                .set('Content-Type', 'application/json')
                .send(data)
                .expect(201)
                .end( (err, res) => {
                    if (err) throw err;

                    expect(res.body).toMatchSnapshot();
                    done();
                })
        })
    })

});

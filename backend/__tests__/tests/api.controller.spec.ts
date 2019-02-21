/// API Controller Integration Tests
/// This test suite uses snapshot testing to measure changes to the model.
/// It's important to note that we must ensure unique information, such as "created"
/// times don't enter into the snapshot, as these would break between runs.
/// @author j-rewerts <jaredrewerts@gmail.com>
/// @author slmyers
/// Credit to Steven Myers for creating the original test suite that was very similar to this one.

import * as request from 'supertest';
import { Test } from '@nestjs/testing';
import { ApiModule } from '../../src/modules/api/api.module'
import { INestApplication } from '@nestjs/common';

describe('/api', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      imports: [ApiModule]
    })
    .compile();
    app = module.createNestApplication();
    await app.init();
  })

  it(`GET /screener -- returns latest screener`, () => {
    let res = request(app.getHttpServer())
      .get('/api/screener/')
      .expect(200)
      .expect(res => {
        delete res.body.created;
        expect(res.body).toMatchSnapshot()
      })
    return res;
  });

  it(`GET /programs -- returns all programs`, () => {
    let res = request(app.getHttpServer())
      .get('/api/program/')
      .expect(200)
      .expect(res => {
        const data = res.body.map( program => {
          delete program.created;
          return program;
        }).sort( (a, b) => a.title.localeCompare(b.title));

        expect(data).toMatchSnapshot();
      })
    return res;
  });

  it(`GET /:guid -- get a specific program`, () => {
    let res = request(app.getHttpServer())
      .get('/api/program/GiufEa3ziFwfBEgkjI2gIlfNkk')
      .expect(200)
      .expect(res => {
        delete res.body.created;
        expect(res.body).toMatchSnapshot();
      })
    return res;
  });

  it(`POST /notification -- returns programs`, () => {
    const data = {
      "wPe0S0iQ23kToF7B2CJd": false,
      "E9L05fKKsRFsNsfjaJ5U": false,
      "VIXBl1tiUyAx8EPuZrzk": false,
      "HVZbfiR8XkcSwJ2FFBNq": true,
      "an2swDUmzfKa61MhdziL": 1,
      "hdPMbny6X0WNhwuiJiMt": 10000
    };

    let res = request(app.getHttpServer())
      .post('/api/notification/')
      .set('Content-Type', 'application/json')
      .send(data)
      .expect(201)
      .expect(res => {
        const data = res.body.map( program => {
          delete program.created;
          return program;
        }).sort( (a, b) => a.title.localeCompare(b.title));

        expect(data).toMatchSnapshot();
      })
    return res;
  });

  afterAll(async () => {
    await app.close();
  });
});
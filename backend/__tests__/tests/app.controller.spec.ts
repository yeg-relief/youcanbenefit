import * as request from 'supertest';
import { Test } from '@nestjs/testing';
import { ApplicationModule } from '../../src/modules/app.module'
import { INestApplication } from '@nestjs/common';

describe('App', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      imports: [ApplicationModule]
    })
    .compile();
    app = module.createNestApplication();
    await app.init();
  })

  it(`GET /`, () => {
    let res = request(app.getHttpServer())
      .get('/');
    return res
      .expect(200)
      .expect(res => {
        expect(res.text).toBe('Hello World!')
      })
  });

  afterAll(async () => {
    await app.close();
  });
});
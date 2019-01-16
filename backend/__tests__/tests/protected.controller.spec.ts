import * as request from 'supertest';
import { Test } from '@nestjs/testing';
import { ProtectedModule } from '../../src/modules/protected/protected.module'
import { INestApplication } from '@nestjs/common';

describe('/protected', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      imports: [ProtectedModule]
    })
    .compile();
    app = module.createNestApplication();
    await app.init();
  })

  it(`GET /login will allow you to login, auth is handled by reverse proxy`, () => {
    return request(app.getHttpServer())
      .get('/protected/login/')
      .expect(200)
      .expect(res => {
        expect(res.body.created).toBe(true)
      })
  });

  afterAll(async () => {
    await app.close();
  });
});
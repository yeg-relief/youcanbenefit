import * as request from 'supertest';
import { Test } from '@nestjs/testing';
import { ProtectedModule } from '../../src/modules/protected'
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

  describe('/login', () => {
    it('GET /login will allow you to login, auth is handled by reverse proxy', () => {
      return request(app.getHttpServer())
        .get('/protected/login/')
        .expect(200)
        .expect(res => {
          expect(res.body.created).toBe(true)
        });
    });
  });

  describe('/program -- CRUD with program datastructures', () => {
    it(' GET /program will return all programs and their queries', () => {
      return request(app.getHttpServer())
        .get('/protected/program/')
        .expect(200)
        .expect(response => {
            const extractedProperties = response.body.map( applicationProgramDto => applicationProgramDto.guid);
            extractedProperties.sort( (a, b) => a.localeCompare(b));

            expect(extractedProperties).toMatchSnapshot();
        })
    });
  });

  afterAll(async () => {
    await app.close();
  });
});
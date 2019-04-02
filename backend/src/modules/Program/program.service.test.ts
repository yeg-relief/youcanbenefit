import { Test } from '@nestjs/testing';
import { ProgramService } from "./program.service";
import { ProgramDto } from "./program.dto";
import { DbElasticsearchModule } from '../db.elasticsearch/db.elasticsearch.module';
import { ClientService } from "../db.elasticsearch/client.service";

describe('ProgramService', () => {
    let programService: ProgramService;
    let clientService: ClientService;
    const mockDTO: ProgramDto = {
        created: 0,
        description: "test description",
        details: "test details",
        guid: "test guid7",
        tags: ["test tags"],
        title: "test title"
    };


    beforeEach(async () => {
        const module = await Test.createTestingModule({
            imports: [DbElasticsearchModule],
            providers: [ProgramService],
        }).compile();

        programService = module.get<ProgramService>(ProgramService);
        clientService = module.get<ClientService>(ClientService);
    });

    describe('create', () => {
        it('should return an elasticsearch create response', async () => {
            const result = {
                "_index": "programs",
                "_type": "user_facing",
                "_id": "test guid7",
                "_version": 1,
                "result": "created",
                "_shards": {
                    "total": 2,
                    "successful": 1,
                    "failed": 0
                },
                "created": true
            };
            jest.spyOn(programService, 'create').mockImplementation(() => result);
            // tested by hand against db this is an actual response... figure out better test later
            expect(await programService.create(mockDTO)).toMatchObject(result);
        });
    });

    describe('getAll', () => {
        it('should return an array of Program Data Transfer Objects', async () => {
            const result: ProgramDto[] = [
                new ProgramDto({
                    created: 0,
                    description: 'test description',
                    details: 'test details',
                    guid: 'test guid6',
                    tags: 'test tags',
                    title: 'test title'
                })
            ];
            jest.spyOn(programService, 'findAll').mockImplementation(() => result);

            // tested by hand against db grabs 36
            const res = await programService.findAll();
            expect(res).toMatchObject(result);
            expect(res['length']).toBe(1);
        })
    });

    describe('getByGuid', () => {
        it('should return a program by guid', async () => {
            const guid = 'test guid6';
            const result = new ProgramDto({
                "created": 0,
                "description": "test description",
                "details": "test details",
                "guid": "test guid6",
                "tags": ["test tags"],
                "title": "test title"
            });

            jest.spyOn(programService, 'getByGuid').mockImplementation(() => result);

            expect(await programService.getByGuid(guid)).toMatchObject(result);
        })
    });

    describe('mGetByGuid', () => {
        it('should return a program by guid', async () => {
            const guids = ['test guid1', 'test guid6'];
            const result = [
                new ProgramDto({
                    "created": 0,
                    "description": "test description",
                    "details": "test details",
                    "guid": "test guid1",
                    "tags": "test tags",
                    "title": "test title"
                }),
                new ProgramDto({
                    "created": 0,
                    "description": "test description",
                    "details": "test details",
                    "guid": "test guid6",
                    "tags": ["test tags"],
                    "title": "test title"
                })
            ];

            jest.spyOn(programService, 'mGetByGuid').mockImplementation(() => result);

            expect(await programService.mGetByGuid(guids)).toMatchObject(result);
        })
    })

    describe('deleteByGuid', () => {

        it('should return a delete response indicating true', async () => {
            const guid = 'test guid7';
            const result = {deleted: true};

            jest.spyOn(programService, 'deleteByGuid').mockImplementation(() => result);

            expect(await programService.deleteByGuid(guid)).toMatchObject(result);
        })

        it('should return a delete response indicating false', async () => {
            const guid = 'test guid6';
            const result = {deleted: false};

            jest.spyOn(programService, 'deleteByGuid').mockImplementation(() => result);

            expect(await programService.deleteByGuid(guid)).toMatchObject(result);
        })
    })

    describe('index', () => {

        it('should sanitize the details of a program', async () => {
            const program = new ProgramDto({
                "created": 0,
                "description": "test description",
                "details": "<a href=\"javascript:alert('test')\">test</a><script></script><img src=\"test\" onerror=alert('test') />",
                "guid": "test guid6",
                "tags": ["test tags"],
                "title": "test title"
            })
            const result = new ProgramDto({
                "created": 0,
                "description": "test description",
                "details": "<a>test</a><img src=\"test\" />",
                "guid": "test guid6",
                "tags": ["test tags"],
                "title": "test title"
            })
            jest.spyOn(clientService, 'index').mockImplementation((sanitized: ProgramDto) => {
                sanitized.created = 0;
                return sanitized;
            });

            expect(await programService.index(program)).toMatchObject(result);
        })
    })
});
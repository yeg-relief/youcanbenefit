import { Test } from '@nestjs/testing';
import { Body } from '@nestjs/common'
import { DataController } from './data.controller';
import { InitService } from './init.service';
import { UploadService } from './upload.service';
import { BackupService } from './backup.service';
import { DbElasticsearchModule } from '../db.elasticsearch/db.elasticsearch.module';

describe('DataController', () => {
  let dataController: DataController;
  let initService: InitService;
  let uploadService: UploadService;
  let backupService: BackupService;

  beforeEach(async () => {
    try {
      const module = await Test.createTestingModule({
          modules: [DbElasticsearchModule],
          controllers: [DataController],
          providers: [InitService, UploadService, BackupService],
        }).compile();

      dataController = module.get<DataController>(DataController);
      initService = module.get<InitService>(InitService);
      uploadService = module.get<UploadService>(UploadService);
      backupService = module.get<BackupService>(BackupService);
    } catch(e) {
      console.error(e)
    }
  });

  describe('backup', () => {
    it('should return empty backup data', async () => {
      const result = {
        programs: {}, 
        queries:  {},
        screener: {},
        programMappings: {},
        queryMappings: {},
        screenerMappings: {}
      }
      const spy = jest.spyOn(backupService, 'execute').mockImplementation(() => result);
      expect(await dataController.downloadData()).toBe(result);
      expect(backupService.execute).toBeCalled();
      spy.mockReset()
    });
  });

  describe('hasBeenInitialized', () => {
    it('should attempt to call the init service', async () => {
      const spy = jest.spyOn(initService, 'hasBeenInitialized').mockImplementation(() => true);
      expect(await dataController.hasBeenInitialized()).toBe(true);
      expect(initService.hasBeenInitialized).toBeCalled();
      spy.mockReset()
    });
  });

  describe('init', () => {
    it('should attempt to call the init service', async () => {
      const fakeBody = Body();
      const result = [
        [false, {}],
        [false, {}],
        [false, {}]
      ]

      const spy = jest.spyOn(initService, 'initialize').mockImplementation(() => result);
      expect(await dataController.init(fakeBody)).toBe(result);
      expect(initService.initialize).toBeCalled();
      spy.mockReset()
    });
  });

  describe('upload', () => {
    it('should return new data', async () => {
      const result = {
        screenerRes: {},
        programRes: {},
        queryRes: {},
        queryMappings: {},
        programMappings: {},
        screenerMappings: {}
      }
      const fakeBody = Body();

      const spy = jest.spyOn(uploadService, 'execute').mockImplementation(() => result);
      expect(await dataController.upload(fakeBody)).toBe(result);
      expect(uploadService.execute).toBeCalled();
      spy.mockReset()
    });
  });
});
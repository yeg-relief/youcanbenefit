import { Module } from '@nestjs/common';
import { DbElasticsearchModule } from '../db.elasticsearch/db.elasticsearch.module';
import {DataController} from './data.controller';
import {InitService} from './init.service';
import {BackupService} from './backup.service';
import {UploadService} from './upload.service';

@Module({
    modules: [
        DbElasticsearchModule,
    ],
    controllers: [
        DataController
    ],
    components: [
        InitService,
        BackupService,
        UploadService
    ],
})
export class DataModule {}

import {Body, Controller, Get, Post} from '@nestjs/common';
import {InitService} from './init.service';
import {BackupService} from './backup.service';
import {UploadService} from './upload.service';

@Controller('data')
export class DataController {
    constructor(
        private initService: InitService,
        private backupService: BackupService,
        private uploadService: UploadService
    ){}

    @Get('/backup')
    downloadData(): Promise<any> {
        return this.backupService.execute()
    }

    @Get('/has-been-initialized')
    async hasBeenInitialized(): Promise<any> {
        return this.initService.hasBeenInitialized()
    }

    @Post('/init')
    init(@Body() body): Promise<any> {
        return this.initService.initialize(body.force)
    }

    @Post('/upload')
    upload(@Body() body): Promise<any> {
        return this.uploadService.execute(body)
    }
}

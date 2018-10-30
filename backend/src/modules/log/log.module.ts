import { Module } from '@nestjs/common';
import { LogService } from "./log.service";

@Module({
    components: [ LogService ],
    exports: [ LogService ]
})
export class LogModule {}

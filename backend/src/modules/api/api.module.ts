import { Module } from '@nestjs/common';
import { ProgramModule } from '../Program'
import { ApiController } from "./api.controller";
import { ScreenerModule } from "../screener";
import { PercolateModule } from "../percolate/percolate.module";

@Module({
    modules: [
        ProgramModule,
        ScreenerModule,
        PercolateModule
    ],
    controllers: [ ApiController ],
    components: [ ApiController ],
    exports: [ ]
})
export class ApiModule {}

import { Module } from '@nestjs/common';
import { ProgramModule } from '../Program'
import { ApiController } from "./api.controller";
import { ScreenerModule } from "../screener";
import { PercolateModule } from "../percolate/percolate.module";

@Module({
    imports: [
        ProgramModule,
        ScreenerModule,
        PercolateModule
    ],
    controllers: [ ApiController ]
})
export class ApiModule {}

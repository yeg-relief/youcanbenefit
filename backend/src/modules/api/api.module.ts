import { Module } from '@nestjs/common';
import { ProgramModule } from '../Program'
import { ApiController } from "./api.controller";
import { ScreenerModule } from "../screener";
import { PercolateModule } from "../percolate/percolate.module";
import { PageModule } from "../page/page.module";

@Module({
    imports: [
        ProgramModule,
        ScreenerModule,
        PercolateModule,
        PageModule
    ],
    controllers: [ ApiController ]
})
export class ApiModule {}

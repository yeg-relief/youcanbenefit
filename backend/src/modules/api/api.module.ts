import { Module } from '@nestjs/common';
import { ProgramModule } from '../Program'
import { ApiController } from "./api.controller";
import { ScreenerModule } from "../screener";
import { PercolateModule } from "../percolate/percolate.module";
import { DocumentModule } from "../document/document.module";

@Module({
    imports: [
        ProgramModule,
        ScreenerModule,
        PercolateModule,
        DocumentModule
    ],
    controllers: [ ApiController ]
})
export class ApiModule {}

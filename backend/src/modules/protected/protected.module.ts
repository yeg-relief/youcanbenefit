import { Module } from '@nestjs/common';
import { ProgramModule } from '../Program'
import { QueryModule } from "../query";
import { ProtectedController } from "./protected.controller";
import { KeyModule } from "../key";
import { ScreenerModule } from "../screener";

@Module({
    modules: [
        ProgramModule,
        QueryModule,
        KeyModule,
        ScreenerModule
    ],
    controllers: [ ProtectedController ],
    components: [ ProtectedController ],
    exports: [ ]
})
export class ProtectedModule {}

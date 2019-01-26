import { Module } from '@nestjs/common';
import { ProgramModule } from '../Program'
import { QueryModule } from "../query";
import { ProtectedController } from "./protected.controller";
import { KeyModule } from "../key";
import { ScreenerModule } from "../screener";

@Module({
    imports: [
        ProgramModule,
        QueryModule,
        KeyModule,
        ScreenerModule
    ],
    controllers: [ ProtectedController ],
    providers: [ ProtectedController ]
})
export class ProtectedModule {}

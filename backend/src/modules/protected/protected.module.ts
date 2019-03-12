import { Module } from '@nestjs/common';
import { ProgramModule } from '../Program'
import { QueryModule } from "../query";
import { ProtectedController } from "./protected.controller";
import { KeyModule } from "../key";
import { ScreenerModule } from "../screener";
import { PageModule } from '../page/page.module';

@Module({
    imports: [
        ProgramModule,
        QueryModule,
        KeyModule,
        ScreenerModule,
        PageModule
    ],
    controllers: [ ProtectedController ],
    providers: [ ProtectedController ]
})
export class ProtectedModule {}

import { Module } from '@nestjs/common';
import { ProgramModule } from '../Program'
import { QueryModule } from "../query";
import { ProtectedController } from "./protected.controller";
import { QuestionModule } from "../question";
import { ScreenerModule } from "../screener";
import { PageModule } from '../page/page.module';

@Module({
    imports: [
        ProgramModule,
        QueryModule,
        QuestionModule,
        ScreenerModule,
        PageModule
    ],
    controllers: [ ProtectedController ],
    providers: [ ProtectedController ]
})
export class ProtectedModule {}

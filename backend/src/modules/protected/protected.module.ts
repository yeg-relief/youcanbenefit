import { Module } from '@nestjs/common';
import { ProgramModule } from '../Program'
import { QueryModule } from "../query";
import { ProtectedController } from "./protected.controller";
import { QuestionModule } from "../question";
import { ScreenerModule } from "../screener";

@Module({
    imports: [
        ProgramModule,
        QueryModule,
        QuestionModule,
        ScreenerModule
    ],
    controllers: [ ProtectedController ],
    providers: [ ProtectedController ]
})
export class ProtectedModule {}

import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { ProgramModule } from "./Program"
import { QueryModule } from "./query"
import { ProtectedModule } from "./protected"
import { ApiModule } from "./api"
import { DataModule } from './data/data.module';
import { LogModule } from './log/log.module'
import { ConfigModule } from './config.module'
import { QuestionModule } from './question/question.module';

@Module({
  imports: [
    ConfigModule,
    ProgramModule,
    QueryModule,
    QuestionModule,
    ProtectedModule,
    ApiModule,
    DataModule,
    LogModule,
    QuestionModule
  ],
  controllers: [AppController]
})
export class ApplicationModule {}

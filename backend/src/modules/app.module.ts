import { Module, MiddlewareConsumer, RequestMethod } from '@nestjs/common';
import { CorsMiddleware } from '../middleware/cors.middleware'
import { AppController } from './app.controller';
import { ProgramModule } from "./Program"
import { QueryModule } from "./query"
import { KeyModule } from "./key"
import { ProtectedModule } from "./protected"
import { ApiModule } from "./api"
import { DataModule } from './data/data.module';
import { LogModule } from './log/log.module'
import { ConfigModule } from './config.module'

@Module({
  imports: [
    ConfigModule,
    ProgramModule,
    QueryModule,
    KeyModule,
    ProtectedModule,
    ApiModule,
    DataModule,
    LogModule
  ],
  controllers: [AppController]
})
export class ApplicationModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(CorsMiddleware).forRoutes({
      path: '*',
      method: RequestMethod.ALL
    })
  }
}

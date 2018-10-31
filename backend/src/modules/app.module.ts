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

@Module({
  modules: [
      ProgramModule,
      QueryModule,
      KeyModule,
      ProtectedModule,
      ApiModule,
      DataModule,
      LogModule
  ],
  controllers: [AppController],
  components: [],
})
export class ApplicationModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(CorsMiddleware).forRoutes({
      path: '*',
      method: RequestMethod.ALL
    })
  }
}

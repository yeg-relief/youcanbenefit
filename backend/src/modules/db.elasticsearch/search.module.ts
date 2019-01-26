import { Module } from '@nestjs/common';
import { ElasticsearchModule } from '@nestjs/elasticsearch'
import { ConfigModule } from '../config.module'
import { ConstantsReadonly } from '../constants.readonly'

@Module({
  imports: [
    ElasticsearchModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (constantsService: ConstantsReadonly) => ({
        host: constantsService.host,
        log: constantsService.logLevel
      }),
      inject: [ConstantsReadonly]
    })
  ]
})

export class SearchModule{};
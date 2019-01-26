import { Module } from '@nestjs/common';
import { ConstantsReadonly } from './constants.readonly'

@Module({
  providers: [
    {
      provide: ConstantsReadonly,
      useValue: new ConstantsReadonly(),
    },
  ],
  exports: [ConstantsReadonly],
})
export class ConfigModule {}
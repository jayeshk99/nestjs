import { Module } from '@nestjs/common';
import { AwsInstanceEntity } from './instanceDetails.entity';

@Module({
  imports: [],
  providers: [AwsInstanceEntity],
  exports: [AwsInstanceEntity],
})
export class EntitiesModule {}

// TODO: implement base entity and extend entities from it

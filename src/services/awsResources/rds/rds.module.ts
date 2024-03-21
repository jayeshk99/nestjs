import { Module } from '@nestjs/common';
import { RDSService } from './rds.service';
import { AwsSdkModule } from 'src/libs/aws-sdk/aws-sdk.module';
import { RepositoriesModule } from 'src/infra/repositories/repositories.module';
import { AwsHelperModule } from '../helper/helper.module';
import { RDSMetricService } from './rds.metric.service';

@Module({
  imports: [RepositoriesModule, AwsSdkModule, AwsHelperModule],
  providers: [RDSService, RDSMetricService],
  exports: [RDSService, RDSMetricService],
})
export class RDSModule {}

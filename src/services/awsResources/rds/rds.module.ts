import { Module } from '@nestjs/common';
import { RdsService } from './rds.service';
import { AwsSdkModule } from 'src/libs/aws-sdk/aws-sdk.module';
import { RepositoriesModule } from 'src/infra/repositories/repositories.module';
import { AwsHelperModule } from '../helper/helper.module';
import { RdsMetricService } from './rds.metric.service';

@Module({
  imports: [RepositoriesModule, AwsSdkModule, AwsHelperModule],
  providers: [RdsService, RdsMetricService],
  exports: [RdsService, RdsMetricService],
})
export class RdsModule {}

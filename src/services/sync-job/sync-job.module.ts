import { Module } from '@nestjs/common';
import { ResourceSyncService } from './resourceSync.service';
import { RepositoriesModule } from 'src/infra/repositories/repositories.module';
import { AwsSdkModule } from 'src/libs/aws-sdk/aws-sdk.module';
import { RDSUtilizationDataSyncService } from './rdsUtilizationDataSyncService';
import { AwsResourceModule } from '../awsResources/resources.module';

@Module({
  imports: [RepositoriesModule, AwsSdkModule, AwsResourceModule],
  providers: [ResourceSyncService, RDSUtilizationDataSyncService],
  exports: [ResourceSyncService, RDSUtilizationDataSyncService],
})
export class SyncJobModule {}

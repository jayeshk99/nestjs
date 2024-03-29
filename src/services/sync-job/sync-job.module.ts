import { Module } from '@nestjs/common';
import { ResourceSyncService } from './resourceSync.service';
import { RepositoriesModule } from 'src/infra/repositories/repositories.module';
import { AwsSdkModule } from 'src/libs/aws-sdk/aws-sdk.module';
import { S3Module } from '../awsResources/s3/s3.module';

@Module({
  imports: [RepositoriesModule, AwsSdkModule, S3Module],
  providers: [ResourceSyncService],
  exports: [ResourceSyncService],
})
export class SyncJobModule {}

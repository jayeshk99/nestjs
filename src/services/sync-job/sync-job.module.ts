import { Module } from '@nestjs/common';
import { ResourceSyncService } from './resourceSync.service';
import { RepositoriesModule } from 'src/infra/repositories/repositories.module';
import { AwsSdkModule } from 'src/libs/aws-sdk/aws-sdk.module';
import { S3Module } from '../awsResources/s3/s3.module';
import { EFSModule } from '../awsResources/efs/efs.module';
import { S3GlacierModule } from '../awsResources/s3Glacier/s3Glacier.module';

@Module({
  imports: [
    RepositoriesModule,
    AwsSdkModule,
    S3Module,
    EFSModule,
    S3GlacierModule,
  ],
  providers: [ResourceSyncService],
  exports: [ResourceSyncService],
})
export class SyncJobModule {}

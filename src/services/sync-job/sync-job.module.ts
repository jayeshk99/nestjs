import { Module } from '@nestjs/common';
import { ResourceSyncService } from './resourceSync.service';
import { RepositoriesModule } from 'src/infra/repositories/repositories.module';
import { AwsSdkModule } from 'src/libs/aws-sdk/aws-sdk.module';
import { S3Module } from '../awsResources/s3/s3.module';
import { EFSModule } from '../awsResources/efs/efs.module';
import { FsxModule } from '../awsResources/fsx/fsx.module';
import { RdsModule } from '../awsResources/rds/rds.module';

@Module({
  imports: [RepositoriesModule, AwsSdkModule, S3Module, EFSModule,FsxModule, RdsModule],
  providers: [ResourceSyncService],
  exports: [ResourceSyncService],
})
export class SyncJobModule {}

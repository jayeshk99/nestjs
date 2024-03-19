import { Module } from '@nestjs/common';
import { ResourceSyncService } from './resourceSync.service';
import { RepositoriesModule } from 'src/infra/repositories/repositories.module';
import { AwsSdkModule } from 'src/libs/aws-sdk/aws-sdk.module';
import { S3Module } from '../awsResources/s3/s3.module';
import { EFSModule } from '../awsResources/efs/efs.module';
import { S3GlacierModule } from '../awsResources/s3Glacier/s3Glacier.module';
import { FsxModule } from '../awsResources/fsx/fsx.module';
import { EKSModule } from '../awsResources/eks/eks.module';
import { ECRModule } from '../awsResources/ecr/ecr.module';
import { RdsModule } from '../awsResources/rds/rds.module';
import { RDSUtilizationDataSyncService } from './rdsUtilizationDataSyncService';
import { ResourceGroupModule } from '../awsResources/resourceGroups/resourceGroups.module';
import { EBSModule } from '../awsResources/ebs/ebs.module';

@Module({
  imports: [
    RepositoriesModule,
    AwsSdkModule,
    S3Module,
    EFSModule,
    S3GlacierModule,
    FsxModule,
    EKSModule,
    ECRModule,
    RdsModule,
    ResourceGroupModule,
    EBSModule
  ],
  providers: [ResourceSyncService, RDSUtilizationDataSyncService],
  exports: [ResourceSyncService, RDSUtilizationDataSyncService],
})
export class SyncJobModule {}

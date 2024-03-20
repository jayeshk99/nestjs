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
import { LoadBalancerModule } from '../awsResources/loadBalancer/loadBalancer.module';
import { ResourceGroupModule } from '../awsResources/resourceGroups/resourceGroups.module';
import { ECSModule } from '../awsResources/ecs/ecs.module';
import { EMRModule } from '../awsResources/emr/emr.module';
import { DynamoDBModule } from '../awsResources/dynamoDb/dynamoDb.module';
import { EC2Module } from '../awsResources/ec2/ec2.module';
import { ElasticBeanStalkModule } from '../awsResources/beanstalk/beanstalk.module';
import { SNSModule } from '../awsResources/sns/sns.module';
import { SQSModule } from '../awsResources/sqs/sqs.module';

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
    LoadBalancerModule,
    ResourceGroupModule,
    ECSModule,
    EMRModule,
    DynamoDBModule,
    EC2Module,
    ElasticBeanStalkModule,
    SNSModule,
    SQSModule,
  ],
  providers: [ResourceSyncService, RDSUtilizationDataSyncService],
  exports: [ResourceSyncService, RDSUtilizationDataSyncService],
})
export class SyncJobModule {}

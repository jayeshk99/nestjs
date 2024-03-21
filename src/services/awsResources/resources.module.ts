import { Module } from '@nestjs/common';
import { ElasticBeanStalkService } from './beanstalk/beanstalk.service';
import { DynamoDBService } from './dynamoDb/dynamoDb.service';
import { EC2Service } from './ec2/ec2.service';
import { ECRService } from './ecr/ecr.service';
import { ECSService } from './ecs/ecs.service';
import { EFSService } from './efs/efs.service';
import { EKSService } from './eks/eks.service';
import { ElastiCacheService } from './elasticache/elasticache.service';
import { EMRService } from './emr/emr.service';
import { FSxService } from './fsx/fsx.service';
import { AWSLoadBalancerService } from './loadBalancer/loadBalancer.service';
import { RDSService } from './rds/rds.service';
import { S3Service } from './s3/s3.service';
import { S3GlacierService } from './s3Glacier/s3Glacier.service';
import { SNSService } from './sns/sns.service';
import { SQSService } from './sqs/sqs.service';
import { ResourceGroupService } from './resourceGroups/resourceGroups.service';
import { RepositoriesModule } from 'src/infra/repositories/repositories.module';
import { AwsSdkModule } from 'src/libs/aws-sdk/aws-sdk.module';
import { AwsHelperModule } from './helper/helper.module';
import { RDSMetricService } from './rds/rds.metric.service';
import { AwsHelperService } from './helper/helper.service';
import { LambdaService } from './lambda/lambda.service';
import { GlobalAcceleratorService } from './globalAccelerator/globalAccelerator.service';
import { AWSWorkspaceService } from './workspace/workspace.service';

@Module({
  imports: [RepositoriesModule, AwsSdkModule, AwsHelperModule],
  providers: [
    ElasticBeanStalkService,
    DynamoDBService,
    EC2Service,
    ECRService,
    ECSService,
    EFSService,
    EKSService,
    ElastiCacheService,
    EMRService,
    FSxService,
    AWSLoadBalancerService,
    RDSService,
    S3Service,
    S3GlacierService,
    SNSService,
    SQSService,
    ResourceGroupService,
    RDSMetricService,
    AwsHelperService,
    LambdaService,
    GlobalAcceleratorService,
    AWSWorkspaceService
  ],
  exports: [
    ElasticBeanStalkService,
    DynamoDBService,
    EC2Service,
    ECRService,
    ECSService,
    EFSService,
    EKSService,
    ElastiCacheService,
    EMRService,
    FSxService,
    AWSLoadBalancerService,
    RDSService,
    S3Service,
    S3GlacierService,
    SNSService,
    SQSService,
    ResourceGroupService,
    RDSMetricService,
    AwsHelperService,
    LambdaService,
    GlobalAcceleratorService,
    AWSWorkspaceService
    
  ],
})
export class AwsResourceModule {}

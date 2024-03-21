import { Module } from '@nestjs/common';
import { ClientConfigurationService } from './clientConfiguration.service';
import { CloudwatchSdkService } from './cloudwatchSdk.service';
import { S3SdkService } from './s3Sdk.service';
import { EC2SdkService } from './ec2Sdk.service';
import { EFSSdkService } from './efsSdk.service';
import { S3GlacierSdkService } from './s3GlacierSdk.service';
import { FsxSdkService } from './fsxSdkService';
import { ECRSdkService } from './ecrSdk.service';
import { EKSSdkService } from './eksSdk.service';
import { RdsSdkService } from './rdsSdk.service';
import { AWSLoadBalancerSdkService } from './awsLoadBalancerSdk.service';
import { ECSSdkService } from './ecsSdk.service';
import { ResourceGroupSdkService } from './resourceGroupSdk.service';
import { CloudTrailSdkService } from './cloudTrailSdk.service';
import { EMRSdkService } from './emr.sdk.service';
import { DynamoDBSdkService } from './dynamoDbSdk.service';
import { BeanStalkSdkService } from './beanstalkSdk.service';
import { SNSSdkService } from './snsSdk.service';
import { SQSSdkService } from './sqsSdk.service';
import { ElastiCacheSdkService } from './elaticacheSdk.service';
import { AwsLambdaSdkService } from './awsLambdaSdk.service';

@Module({
  imports: [],
  providers: [
    ClientConfigurationService,
    CloudwatchSdkService,
    S3SdkService,
    EC2SdkService,
    EFSSdkService,
    S3GlacierSdkService,
    FsxSdkService,
    ECRSdkService,
    EKSSdkService,
    FsxSdkService,
    RdsSdkService,
    AWSLoadBalancerSdkService,
    ECSSdkService,
    RdsSdkService,
    ResourceGroupSdkService,
    CloudTrailSdkService,
    EMRSdkService,
    DynamoDBSdkService,
    BeanStalkSdkService,
    SNSSdkService,
    SQSSdkService,
    ElastiCacheSdkService,
    AwsLambdaSdkService
  ],
  exports: [
    ClientConfigurationService,
    CloudwatchSdkService,
    S3SdkService,
    EC2SdkService,
    EFSSdkService,
    S3GlacierSdkService,
    FsxSdkService,
    ECRSdkService,
    EKSSdkService,
    FsxSdkService,
    RdsSdkService,
    AWSLoadBalancerSdkService,
    ECSSdkService,
    RdsSdkService,
    ResourceGroupSdkService,
    CloudTrailSdkService,
    EMRSdkService,
    DynamoDBSdkService,
    BeanStalkSdkService,
    SNSSdkService,
    SQSSdkService,
    ElastiCacheSdkService,
    AwsLambdaSdkService

  ],
})
export class AwsSdkModule {}

import { Module } from '@nestjs/common';
import { ClientConfigurationService } from './clientConfiguration.service';
import { CloudwatchSdkService } from './cloudwatchSdk.service';
import { S3SdkService } from './s3Sdk.service';
import { EC2SdkService } from './ec2Sdk.service';
import { EFSSdkService } from './efsSdk.service';
import { FsxSdkService } from './fsxSdkService';

@Module({
  imports: [],
  providers: [
    ClientConfigurationService,
    CloudwatchSdkService,
    S3SdkService,
    EC2SdkService,
    EFSSdkService,
    FsxSdkService
  ],
  exports: [
    ClientConfigurationService,
    CloudwatchSdkService,
    S3SdkService,
    EC2SdkService,
    EFSSdkService,
    FsxSdkService
  ],
})
export class AwsSdkModule {}

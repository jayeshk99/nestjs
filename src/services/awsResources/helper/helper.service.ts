import { Injectable } from '@nestjs/common';
import { AWSMetricProps } from 'src/common/interfaces/awsClient.interface';
import * as AWS from 'aws-sdk';
import { CloudwatchSdkService } from 'src/libs/aws-sdk/cloudwatchSdk.service';
import { AWSPricingReq } from 'src/common/interfaces/common.interfaces';

@Injectable()
export class AwsHelperService {
  constructor(private readonly cloudWatchService: CloudwatchSdkService) {}
  async getMetricsData(
    params: AWSMetricProps,
    cloudWatchClient: AWS.CloudWatch,
  ) {
    const result = await this.cloudWatchService.getMetricSatistics(
      cloudWatchClient,
      params,
    );
    return result;
  }
}

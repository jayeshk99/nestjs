import { Injectable } from '@nestjs/common';
import { ClientConfigurationService } from './clientConfiguration.service';
import * as AWS from 'aws-sdk';
import { Client } from '@aws-sdk/types';
import { AWSMetricProps } from 'src/common/interfaces/awsClient.interface';
@Injectable()
export class CloudwatchSdkService {
  async getMetricSatistics(
    cloudWatchClient: AWS.CloudWatch,
    params: AWSMetricProps,
  ) {
    const { Namespace, MetricName, Dimensions, StartTime, EndTime, Period } =
      params;
    const result = await cloudWatchClient
      .getMetricStatistics({
        Dimensions,
        Namespace,
        MetricName,
        Period: Period || 60,
        Statistics: ['Average', 'Minimum', 'Maximum', 'Sum'],
        StartTime,
        EndTime,
      })
      .promise();
    return result.Datapoints?.sort(
      (data1: any, data2: any) => data1.Timestamp - data2.Timestamp,
    );
  }
}

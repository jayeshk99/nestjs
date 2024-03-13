import { Injectable } from '@nestjs/common';
import { ClientConfigurationService } from './clientConfiguration.service';
import * as AWS from 'aws-sdk';
import { Client } from '@aws-sdk/types';
import { AWSMetricProps } from 'src/common/interfaces/awsClient.interface';
import {
  CloudWatchClient,
  GetMetricStatisticsCommand,
  GetMetricStatisticsCommandOutput,
} from '@aws-sdk/client-cloudwatch';
@Injectable()
export class CloudwatchSdkService {
  async getMetricSatistics(
    cloudWatchClient: CloudWatchClient,
    params: AWSMetricProps,
  ): Promise<GetMetricStatisticsCommandOutput['Datapoints']> {
    const { Namespace, MetricName, Dimensions, StartTime, EndTime, Period } =
      params;
    const result = await cloudWatchClient.send(
      new GetMetricStatisticsCommand({
        Dimensions,
        Namespace,
        MetricName,
        Period: Period || 60,
        Statistics: ['Average', 'Minimum', 'Maximum', 'Sum'],
        StartTime,
        EndTime,
      }),
    );

    return result.Datapoints?.sort(
      (data1: any, data2: any) => data1.Timestamp - data2.Timestamp,
    );
  }
}

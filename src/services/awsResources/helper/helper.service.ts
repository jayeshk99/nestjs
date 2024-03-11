import { Injectable } from '@nestjs/common';
import { AWSMetricProps } from 'src/common/interfaces/awsClient.interface';
import * as AWS from 'aws-sdk';
import { CloudwatchSdkService } from 'src/libs/aws-sdk/cloudwatchSdk.service';
import { AWSPricingReq } from 'src/common/interfaces/common.interfaces';
import { SrcCodeOrDbAnalysisStatus } from 'aws-sdk/clients/migrationhubstrategy';
import { GetMetricStatisticsOutput } from 'aws-sdk/clients/cloudwatch';
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

  async getRDSUtilizationData(
    client: AWS.CloudWatch,
    InstanceName: string,
    startDate: Date,
    endDate: Date,
  ): Promise<{
    CPUUtilization: GetMetricStatisticsOutput['Datapoints'];
    DatabaseConnections: GetMetricStatisticsOutput['Datapoints'];
    ReadIOPS: GetMetricStatisticsOutput['Datapoints'];
    WriteIOPS: GetMetricStatisticsOutput['Datapoints'];
    NetworkReceiveThroughput: GetMetricStatisticsOutput['Datapoints'];
    NetworkTransmitThroughput: GetMetricStatisticsOutput['Datapoints'];
  }> {
    try {
      const metricNames = [
        'CPUUtilization',
        'DatabaseConnections',
        'ReadIOPS',
        'WriteIOPS',
        'NetworkReceiveThroughput',
        'NetworkTransmitThroughput',
      ];
      const metricDataPromises = metricNames.map((metricName: string) => {
        return this.fetchMetricData(
          client,
          metricName,
          InstanceName,
          startDate,
          endDate,
        );
      });
      const [
        CPUUtilization,
        DatabaseConnections,
        ReadIOPS,
        WriteIOPS,
        NetworkReceiveThroughput,
        NetworkTransmitThroughput,
      ] = await Promise.all(metricDataPromises);

      return {
        CPUUtilization,
        DatabaseConnections,
        ReadIOPS,
        WriteIOPS,
        NetworkReceiveThroughput,
        NetworkTransmitThroughput,
      };
    } catch (error) {
      console.log('Error fetching RDS Utilization data', error.message);
    }
  }

  async fetchMetricData(
    client: AWS.CloudWatch,
    metricName: string,
    InstanceName: string,
    startDate: Date,
    endDate: Date,
  ): Promise<GetMetricStatisticsOutput['Datapoints']> {
    const input = {
      Namespace: 'AWS/RDS',
      MetricName: metricName,
      Dimensions: [{ Name: 'DBInstanceIdentifier', Value: `${InstanceName}` }],
      StartTime: startDate,
      EndTime: endDate,
      Period: 60,
      Statistics: ['Average', 'Minimum', 'Maximum'],
      Unit:
        metricName === 'CPUUtilization'
          ? 'Percent'
          : metricName === 'DatabaseConnections'
            ? 'Count'
            : metricName === 'ReadIOPS' || metricName === 'WriteIOPS'
              ? 'Count/Second'
              : 'Bytes/Second',
    };
    const response = await client.getMetricStatistics(input).promise();
    return response.Datapoints;
  }
}

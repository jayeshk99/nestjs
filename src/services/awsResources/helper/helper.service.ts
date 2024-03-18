import { Injectable, Logger } from '@nestjs/common';
import { AWSMetricProps } from 'src/common/interfaces/awsClient.interface';
import { CloudwatchSdkService } from 'src/libs/aws-sdk/cloudwatchSdk.service';
import {
  UtilizationOutput,
  awsUsageCostProps,
} from 'src/common/interfaces/common.interfaces';
import { GetMetricStatisticsOutput } from 'aws-sdk/clients/cloudwatch';
import { CostDetailsProps } from 'src/common/interfaces/costDetails.interface';
import { PRODUCT_CODE } from 'src/common/constants/constants';
import { AwsUsageDetailsRepository } from 'src/infra/repositories/awsUsageDetails.repository';
import * as moment from 'moment';
import {
  CloudWatchClient,
  GetMetricStatisticsCommand,
  GetMetricStatisticsCommandOutput,
} from '@aws-sdk/client-cloudwatch';
@Injectable()
export class AwsHelperService {
  private readonly logger = new Logger(AwsHelperService.name);
  constructor(
    private readonly cloudWatchService: CloudwatchSdkService,
    private readonly awsUsageDetailsRepository: AwsUsageDetailsRepository,
  ) {}
  async getMetricsData(
    params: AWSMetricProps,
    cloudWatchClient: CloudWatchClient,
  ) {
    const result = await this.cloudWatchService.getMetricSatistics(
      cloudWatchClient,
      params,
    );
    return result;
  }

  async getRDSUtilizationData(
    client: CloudWatchClient,
    InstanceName: string,
    startDate: Date,
    endDate: Date,
  ): Promise<{
    CPUUtilization: GetMetricStatisticsCommandOutput['Datapoints'];
    DatabaseConnections: GetMetricStatisticsCommandOutput['Datapoints'];
    ReadIOPS: GetMetricStatisticsCommandOutput['Datapoints'];
    WriteIOPS: GetMetricStatisticsCommandOutput['Datapoints'];
    NetworkReceiveThroughput: GetMetricStatisticsCommandOutput['Datapoints'];
    NetworkTransmitThroughput: GetMetricStatisticsCommandOutput['Datapoints'];
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
    client: CloudWatchClient,
    metricName: string,
    InstanceName: string,
    startDate: Date,
    endDate: Date,
  ): Promise<GetMetricStatisticsCommandOutput['Datapoints']> {
    const response = await client.send(
      new GetMetricStatisticsCommand({
        Namespace: 'AWS/RDS',
        MetricName: metricName,
        Dimensions: [
          { Name: 'DBInstanceIdentifier', Value: `${InstanceName}` },
        ],
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
      }),
    );
    return response.Datapoints;
  }
  async getCostDetails(data: CostDetailsProps): Promise<{
    dailyCost: number;
    isPrevMonthCostAvailable: boolean;
    prevMonthCost: number;
  }> {
    try {
      const { resourceId, accountId, productCode } = data;
      const usageDetails =
        await this.awsUsageDetailsRepository.getOneDayCostOfResource({
          resourceId: resourceId,
          productCode: productCode,
          awsAccountId: accountId,
        });
      const dailyCost = usageDetails && usageDetails.unBlendedCost;

      const currentDate = moment(new Date()).format('YYYY-MM-DD');
      const startDate = moment(new Date())
        .subtract(1, 'months')
        .format('YYYY-MM-DD');

      const usageCostFields: awsUsageCostProps = {
        resourceId: resourceId,
        prouductCode: productCode,
        startTime: startDate,
        endTime: currentDate,
        awsAccountId: accountId,
      };

      const monthlyCost =
        await this.awsUsageDetailsRepository.getAwsStorageUsageCost(
          usageCostFields,
        );
      const prevMonthCost: number = monthlyCost?.costSum;
      const isPrevMonthCostAvailable =
        await this.awsUsageDetailsRepository.findPrevMonthCostAvailable({
          resourceId: resourceId,
          prouductCode: productCode,
          awsAccountId: accountId,
          billingDate: moment(new Date())
            .subtract(1, 'months')
            .format('YYYY-MM-DD'),
        });
      return { dailyCost, isPrevMonthCostAvailable, prevMonthCost };
    } catch (error) {
      this.logger.log(
        `Error in getting cost details for ${data.productCode} for account: ${data.accountId} ${error}`,
      );
    }
  }

  mapUtilizationData(
    utilizationData: GetMetricStatisticsCommandOutput['Datapoints'],
    dbInstanceIdentifier: string,
    accountId: string,
    metricName: string,
  ): UtilizationOutput[] {
    return utilizationData.map((data) => ({
      ...data,
      dbInstanceIdentifier: dbInstanceIdentifier,
      accountId: accountId,
      metricName: metricName,
    }));
  }
}

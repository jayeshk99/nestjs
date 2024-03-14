import { Injectable, Logger } from '@nestjs/common';
import { AWSMetricProps } from 'src/common/interfaces/awsClient.interface';
import { CloudwatchSdkService } from 'src/libs/aws-sdk/cloudwatchSdk.service';
import {
  UtilizationOutput,
  awsUsageCostProps,
} from 'src/common/interfaces/common.interfaces';
import { CostDetailsProps } from 'src/common/interfaces/costDetails.interface';
import { PRODUCT_CODE } from 'src/common/constants/constants';
import { AwsUsageDetailsRepository } from 'src/infra/repositories/awsUsageDetails.repository';
import * as moment from 'moment';
import {
  CloudWatchClient,
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
  ): Promise<GetMetricStatisticsCommandOutput['Datapoints']> {
    const result = await this.cloudWatchService.getMetricSatistics(
      cloudWatchClient,
      params,
    );
    return result;
  }

  async getCostDetails(data: CostDetailsProps): Promise<{
    dailyCost: number;
    isPrevMonthCostAvailable: boolean;
    prevMonthCost: number;
  }> {
    try {
      const { resourceId, accountId, productName } = data;
      const usageDetails =
        await this.awsUsageDetailsRepository.getOneDayCostOfResource({
          resourceId: resourceId,
          productCode: PRODUCT_CODE[`${productName}`],
          awsAccountId: accountId,
        });
      const dailyCost = usageDetails && usageDetails.unBlendedCost;

      const currentDate = moment(new Date()).format('YYYY-MM-DD');
      const startDate = moment(new Date())
        .subtract(1, 'months')
        .format('YYYY-MM-DD');

      const usageCostFields: awsUsageCostProps = {
        resourceId: resourceId,
        prouductCode: PRODUCT_CODE[`${productName}`],
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
          prouductCode: PRODUCT_CODE[`${productName}`],
          awsAccountId: accountId,
          billingDate: moment(new Date())
            .subtract(1, 'months')
            .format('YYYY-MM-DD'),
        });
      return { dailyCost, isPrevMonthCostAvailable, prevMonthCost };
    } catch (error) {
      this.logger.log(
        `Error in getting cost details for ${data.productName} for account: ${data.accountId} ${error}`,
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
      timestamp: data.Timestamp,
      maximum: data.Maximum,
      minimum: data.Minimum,
      unit: data.Unit,
      average: data.Average,
      dbInstanceIdentifier: dbInstanceIdentifier,
      accountId: accountId,
      metricName: metricName,
    }));
  }
}

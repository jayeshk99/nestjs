import { Injectable, Logger } from '@nestjs/common';
import { ClientCredentials } from 'src/common/interfaces/awsClient.interface';
import { ClientConfigurationService } from 'src/libs/aws-sdk/clientConfiguration.service';
import { AwsUsageDetailsRepository } from 'src/infra/repositories/awsUsageDetails.repository';
import { PRODUCT_CODE } from 'src/common/constants/constants';
import { awsUsageCostProps } from 'src/common/interfaces/common.interfaces';
import { EKSRepository } from 'src/infra/repositories/eks.repository';
import { EKSSdkService } from 'src/libs/aws-sdk/eksSdk.service';
import {
  EKSCostDetailProps,
  EKSProps,
} from 'src/common/interfaces/eks.interface';

@Injectable()
export class EKSService {
  private readonly logger = new Logger(EKSService.name);

  constructor(
    private readonly clientConfigurationService: ClientConfigurationService,
    private readonly awsUsageDetailsRepository: AwsUsageDetailsRepository,
    private readonly eksRepository: EKSRepository,
    private readonly eksSdkService: EKSSdkService,
  ) {}
  async fetchEksDetails(data: ClientCredentials) {
    try {
      this.logger.log(
        `EKS details job STARTED for account: ${data.accountId} region: ${data.region}`,
      );
      const { accessKeyId, secretAccessKey, accountId, region } = data;
      const eksClient =
        await this.clientConfigurationService.getEksClient(data);
      const eksList = await this.eksSdkService.listEks(eksClient);

      if (eksList && eksList.length) {
        for (let i = 0; i < eksList.length; i++) {
          const clusterName = eksList[i];
          const cluster = await this.eksSdkService.describeCluster(eksClient, {
            name: clusterName,
          });

          const { currencyCode, eksPerDayCost, eksPrevMonthCost } =
            await this.efsCostDetails({
              clusterArn: cluster.arn,
              accountId,
            });
          const ClusterFields: EKSProps = {
            accountId: accountId,
            clusterName: cluster.name,
            clusterArn: cluster.arn,
            createdOn: cluster.createdAt,
            region: region,

            monthlyCost: eksPrevMonthCost || 0,
            currencyCode:
              (currencyCode && currencyCode?.billing_currency) || '',
            isActive: 1,
            type: 0,
          };

          const isEksExist = await this.eksRepository.findEks(ClusterFields);
          if (isEksExist) {
            await this.eksRepository.updateEks(isEksExist.id, ClusterFields);
          } else {
            await this.eksRepository.createEks(ClusterFields);
          }
        }
      }
      this.logger.log(
        `EKS details job Completed for account: ${data.accountId} region: ${data.region}`,
      );
    } catch (error) {
      this.logger.log(
        `Error in getting EKS Details for account: ${data.accountId} region: ${data.region}: Error: ${error}`,
      );
    }
  }

  async efsCostDetails(data: EKSCostDetailProps) {
    const { clusterArn, accountId } = data;
    const eksUsageDetails =
      await this.awsUsageDetailsRepository.getOneDayCostOfResource({
        resourceId: clusterArn,
        productCode: PRODUCT_CODE.EKS,
        awsAccountId: accountId,
      });
    const currencyCode =
      await this.awsUsageDetailsRepository.getAwsCurrencyCode(accountId);
    const eksPerDayCost = eksUsageDetails && eksUsageDetails.unBlendedCost;
    const currentDate = new Date().toISOString().split('T')[0];
    const currentBillDate = new Date(currentDate);
    const startDate = new Date(
      currentBillDate.setDate(currentBillDate.getDate() - 29),
    )
      .toISOString()
      .split('T')[0];

    const usageCostFields: awsUsageCostProps = {
      resourceId: clusterArn,
      prouductCode: PRODUCT_CODE.EKS,
      startTime: startDate,
      endTime: currentDate,
      awsAccountId: accountId,
    };
    const eksMonthlyCost =
      await this.awsUsageDetailsRepository.getAwsStorageUsageCost(
        usageCostFields,
      );
    const eksPrevMonthCost: number = eksMonthlyCost?.costSum;
    return { currencyCode, eksPerDayCost, eksPrevMonthCost };
  }
}

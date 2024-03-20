import { Injectable, Logger } from '@nestjs/common';
import { ClientCredentials } from 'src/common/interfaces/awsClient.interface';
import { ClientConfigurationService } from 'src/libs/aws-sdk/clientConfiguration.service';
import { AwsUsageDetailsRepository } from 'src/infra/repositories/awsUsageDetails.repository';
import { PRODUCT_CODE } from 'src/common/constants/constants';
import { awsUsageCostProps } from 'src/common/interfaces/common.interfaces';
import { ECRSdkService } from 'src/libs/aws-sdk/ecrSdk.service';
import { ECRRepository } from 'src/infra/repositories/ecr.repository';
import {
  ECRProps,
  ecrCostDetailProps,
} from 'src/common/interfaces/ecrProps.interface';
import { AwsHelperService } from '../helper/helper.service';
import * as moment from 'moment';

@Injectable()
export class ECRService {
  private readonly logger = new Logger(ECRService.name);

  constructor(
    private readonly clientConfigurationService: ClientConfigurationService,
    private readonly awsUsageDetailsRepository: AwsUsageDetailsRepository,
    private readonly ecrRepository: ECRRepository,
    private readonly ecrSdkService: ECRSdkService,
    private readonly awsHelperService: AwsHelperService,
  ) {}
  async fetchEcrDetails(data: ClientCredentials) {
    try {
      this.logger.log(
        `ECR details job STARTED for account: ${data.accountId} region: ${data.region}`,
      );
      const { accessKeyId, secretAccessKey, accountId, region, currencyCode } =
        data;
      const ecrClient =
        await this.clientConfigurationService.getEcrClient(data);
      const ecrList = await this.ecrSdkService.listEcr(ecrClient);

      if (ecrList && ecrList.length) {
        for (let i = 0; i < ecrList.length; i++) {
          const repository = ecrList[i];
          const repositoryImages = await this.ecrSdkService.listImages(
            ecrClient,
            {
              registryId: repository.registryId,
              repositoryName: repository.repositoryName,
            },
          );
          const { dailyCost, isPrevMonthCostAvailable, prevMonthCost } =
            await this.awsHelperService.getCostDetails({
              resourceId: repository.repositoryArn,
              accountId: accountId,
              productCode: PRODUCT_CODE.ECR,
            });

          const RepositoryFields: ECRProps = {
            accountId: accountId,
            repositoryName: repository.repositoryName,
            repositoryArn: repository.repositoryArn,
            imagesCount: repositoryImages?.imageIds?.length || 0,
            createdOn: repository.createdAt,
            region: region,
            lastUpdated: null,
            monthlyCost: isPrevMonthCostAvailable
              ? prevMonthCost
              : dailyCost * moment().daysInMonth() || 0,
            currencyCode: currencyCode,
            isActive: 1,
            type: 0,
          };
          const isEcrExist = await this.ecrRepository.findByCondition({
            where: {
              repositoryArn: repository.repositoryArn,
              accountId,
              region,
              isActive: 1,
            },
          });
          if (isEcrExist) {
            await this.ecrRepository.update(isEcrExist.id, RepositoryFields);
          } else {
            const ecr = this.ecrRepository.create(RepositoryFields);
            await this.ecrRepository.save(ecr);
          }
        }
      }
      this.logger.log(
        `ECR details job Completed for account: ${data.accountId} region: ${data.region}`,
      );
    } catch (error) {
      this.logger.log(
        `Error in getting ECR Details for account: ${data.accountId} region: ${data.region}: Error: ${error}`,
      );
    }
  }

  async ecrCostDetails(data: ecrCostDetailProps) {
    const { repositoryArn, accountId } = data;
    const ecrUsageDetails =
      await this.awsUsageDetailsRepository.getOneDayCostOfResource({
        resourceId: repositoryArn,
        productCode: PRODUCT_CODE.ECR,
        awsAccountId: accountId,
      });
    const currencyCode =
      await this.awsUsageDetailsRepository.getAwsCurrencyCode(accountId);
    const ecrPerDayCost = ecrUsageDetails && ecrUsageDetails.unBlendedCost;
    const currentDate = new Date().toISOString().split('T')[0];
    const currentBillDate = new Date(currentDate);
    const startDate = new Date(
      currentBillDate.setDate(currentBillDate.getDate() - 29),
    )
      .toISOString()
      .split('T')[0];

    const usageCostFields: awsUsageCostProps = {
      resourceId: repositoryArn,
      prouductCode: PRODUCT_CODE.EFS,
      startTime: startDate,
      endTime: currentDate,
      awsAccountId: accountId,
    };
    const ecrMonthlyCost =
      await this.awsUsageDetailsRepository.getAwsStorageUsageCost(
        usageCostFields,
      );
    const ecrPrevMonthCost: number = ecrMonthlyCost?.costSum;
    return { currencyCode, ecrPerDayCost, ecrPrevMonthCost };
  }
}

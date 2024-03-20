import { Injectable, Logger } from '@nestjs/common';
import { ClientCredentials } from 'src/common/interfaces/awsClient.interface';
import { ClientConfigurationService } from 'src/libs/aws-sdk/clientConfiguration.service';
import { EFSSdkService } from 'src/libs/aws-sdk/efsSdk.service';
import {
  EFSProps,
  EfsCostDetailProps,
} from 'src/common/interfaces/efs.interface';
import { AwsUsageDetailsRepository } from 'src/infra/repositories/awsUsageDetails.repository';
import { PRODUCT_CODE } from 'src/common/constants/constants';
import { awsUsageCostProps } from 'src/common/interfaces/common.interfaces';
import { EFSRepository } from 'src/infra/repositories/efs.repository';
import { AwsHelperService } from '../helper/helper.service';
import * as moment from 'moment';

@Injectable()
export class EFSService {
  private readonly logger = new Logger(EFSService.name);

  constructor(
    private readonly clientConfigurationService: ClientConfigurationService,
    private readonly awsUsageDetailsRepository: AwsUsageDetailsRepository,
    private readonly efsRepository: EFSRepository,
    private readonly efsSdkService: EFSSdkService,
    private readonly awsHelperService: AwsHelperService,
  ) {}
  async syncEFSFileSystem(data: ClientCredentials) {
    try {
      this.logger.log(
        `started Syncing EFS file system for account:${data.accountId} region:${data.region}`,
      );
      const { accessKeyId, secretAccessKey, accountId, region, currencyCode } =
        data;
      const efsClient =
        await this.clientConfigurationService.getEFSClient(data);
      const efsList = await this.efsSdkService.listEfs(efsClient);
      if (efsList && efsList.length) {
        for (let i = 0; i < efsList.length; i++) {
          const efsDetails = efsList[i];
          const { dailyCost, isPrevMonthCostAvailable, prevMonthCost } =
            await this.awsHelperService.getCostDetails({
              resourceId: efsDetails.FileSystemArn,
              accountId: accountId,
              productCode: PRODUCT_CODE.EFS,
            });
          const EFSFields: EFSProps = {
            fileSystemArn: efsDetails.FileSystemArn,
            fileSystemId: efsDetails.FileSystemId,
            storageOwner: efsDetails.OwnerId,
            storageName: efsDetails.Name,
            createdOn: efsDetails.CreationTime,
            capacityUsed: (efsDetails.SizeInBytes?.Value || 0) / 1024,
            status: efsDetails.LifeCycleState,
            region: region,
            accountId: accountId,
            unit: 'KB',
            pricePerHour: (dailyCost && dailyCost / 24) || 0,
            currencyCode: currencyCode,
            storagePricePerMonth: isPrevMonthCostAvailable
              ? prevMonthCost
              : dailyCost * moment().daysInMonth() || 0,
          };
          const isEfsExist = await this.efsRepository.findByCondition({
            where: {
              accountId,
              fileSystemArn: efsDetails.FileSystemArn,
              region,
              isActive: 1,
            },
          });
          if (isEfsExist) {
            await this.efsRepository.update(isEfsExist.id, EFSFields);
          } else {
            const efs = this.efsRepository.create(EFSFields);
            await this.efsRepository.save(efs);
          }
        }
      }
      this.logger.log(
        `completed Syncing EFS file system for account:${data.accountId} region:${data.region}`,
      );
    } catch (error) {
      this.logger.log(
        `Error in syncing EFS Details for account: ${data.accountId} region: ${data.region}: Error: ${error}`,
      );
    }
  }

  async efsCostDetails(data: EfsCostDetailProps) {
    const { fileSystemArn, accountId } = data;
    const efsUsageDetails =
      await this.awsUsageDetailsRepository.getOneDayCostOfResource({
        resourceId: fileSystemArn,
        productCode: PRODUCT_CODE.EFS,
        awsAccountId: accountId,
      });
    const currencyCode =
      await this.awsUsageDetailsRepository.getAwsCurrencyCode(accountId);
    const efsPerDayCost = efsUsageDetails && efsUsageDetails.unBlendedCost;
    const currentDate = new Date().toISOString().split('T')[0];
    const currentBillDate = new Date(currentDate);
    const startDate = new Date(
      currentBillDate.setDate(currentBillDate.getDate() - 29),
    )
      .toISOString()
      .split('T')[0];

    const usageCostFields: awsUsageCostProps = {
      resourceId: fileSystemArn,
      prouductCode: PRODUCT_CODE.EFS,
      startTime: startDate,
      endTime: currentDate,
      awsAccountId: accountId,
    };
    const efsMonthlyCost =
      await this.awsUsageDetailsRepository.getAwsStorageUsageCost(
        usageCostFields,
      );
    const efsPrevMonthCost: number = efsMonthlyCost?.costSum;
    return { currencyCode, efsPerDayCost, efsPrevMonthCost };
  }
}

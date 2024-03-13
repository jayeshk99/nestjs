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

@Injectable()
export class EFSService {
  private readonly logger = new Logger(EFSService.name);

  constructor(
    private readonly clientConfigurationService: ClientConfigurationService,
    private readonly awsUsageDetailsRepository: AwsUsageDetailsRepository,
    private readonly efsRepository: EFSRepository,
    private readonly efsSdkService: EFSSdkService,
  ) {}
  async fetchEfsDetails(data: ClientCredentials) {
    try {
      this.logger.log(
        `EFS details job STARTED for account: ${data.accountId} region: ${data.region}`,
      );
      const { accessKeyId, secretAccessKey, accountId, region } = data;
      const efsClient =
        await this.clientConfigurationService.getEFSClient(data);
      const efsList = await this.efsSdkService.listEfs(efsClient);
      if (efsList && efsList.length) {
        for (let i = 0; i < efsList.length; i++) {
          const efsDetails = efsList[i];
          const { currencyCode, efsPerDayCost, efsPrevMonthCost } =
            await this.efsCostDetails({
              fileSystemArn: efsDetails.FileSystemArn,
              accountId,
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
            pricePerHour: (efsPerDayCost && efsPerDayCost / 24) || 0,
            currencyCode:
              (currencyCode && currencyCode?.billing_currency) || '',
            storagePricePerMonth: efsPrevMonthCost || 0,
          };
          const isEfsExist = await this.efsRepository.findEFS(EFSFields);
          if (isEfsExist) {
            await this.efsRepository.updateEfs(isEfsExist.id, EFSFields);
          } else {
            await this.efsRepository.createEfs(EFSFields);
          }
        }
      }
    } catch (error) {
      this.logger.log(
        `Error in getting EFS Details for account: ${data.accountId} region: ${data.region}: Error: ${error}`,
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
    console.log('efsUsageDetails:', efsUsageDetails);
    const currencyCode =
      await this.awsUsageDetailsRepository.getAwsCurrencyCode(accountId);
    const efsPerDayCost = efsUsageDetails && efsUsageDetails.unBlendedCost;
    console.log('efsPerDayCost:', efsPerDayCost);
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

// 19	"fs-0f6ff518f9402f54d"		"386152433177"	6	"2023-11-20 09:48:00+00"	"us-east-1"	"available"	1	0	"2023-12-29 09:09:02.928+00"	"2024-03-07 02:00:19.316+00"	"386152433177"	"KB"	1.2458333333333335e-09	"USD"	1.6307000000000005e-06	466	466		"arn:aws:elasticfilesystem:us-east-1:386152433177:file-system/fs-0f6ff518f9402f54d"

import { Injectable, Logger } from '@nestjs/common';
import { ClientCredentials } from 'src/common/interfaces/awsClient.interface';
import { S3GlacierProps } from 'src/common/interfaces/s3Glacier.interface';
import { AwsUsageDetailsRepository } from 'src/infra/repositories/awsUsageDetails.repository';
import { S3GlacierRepository } from 'src/infra/repositories/s3Glacier.repository';
import { ClientConfigurationService } from 'src/libs/aws-sdk/clientConfiguration.service';
import { S3GlacierSdkService } from 'src/libs/aws-sdk/s3GlacierSdk.service';
import { AwsHelperService } from '../helper/helper.service';
import { PRODUCT_CODE } from 'src/common/constants/constants';
import moment from 'moment';

@Injectable()
export class S3GlacierService {
  private readonly logger = new Logger(S3GlacierService.name);

  constructor(
    private readonly clientConfigurationService: ClientConfigurationService,
    private readonly awsUsageDetailsRepository: AwsUsageDetailsRepository,
    private readonly awsHelperService: AwsHelperService,
    private readonly s3GlacierSdkService: S3GlacierSdkService,
    private readonly s3GlacierRepository: S3GlacierRepository,
  ) {}
  async syncS3GlacierVaults(data: ClientCredentials) {
    try {
      this.logger.log(
        `started Syncing S3 Glacier vaults for account:${data.accountId} region:${data.region}`,
      );
      const { accessKeyId, secretAccessKey, accountId, region, currencyCode } =
        data;
      const efsClient =
        await this.clientConfigurationService.getS3GlacierClient(data);
      const glacierList = await this.s3GlacierSdkService.listS3GlacierVaults(
        efsClient,
        accountId,
      );
      if (glacierList && glacierList.length) {
        for (let glacierVaultDetails of glacierList) {
          const { dailyCost, isPrevMonthCostAvailable, prevMonthCost } =
            await this.awsHelperService.getCostDetails({
              resourceId: glacierVaultDetails.VaultARN,
              accountId: accountId,
              productCode: PRODUCT_CODE['S3 Glacier'],
            });
          let a = glacierVaultDetails.CreationDate;
          const glacierVaultFields: S3GlacierProps = {
            vaultName: glacierVaultDetails.VaultName,
            vaultARN: glacierVaultDetails.VaultARN,
            lastInventoryDate: new Date(glacierVaultDetails.LastInventoryDate),
            numberOfArchives: glacierVaultDetails.NumberOfArchives,
            size: glacierVaultDetails.SizeInBytes,
            createdOn: new Date(glacierVaultDetails.CreationDate),
            accountId: accountId,
            region: region,
            unit: 'Byte',
            currencyCode: currencyCode,
            predictedMonthlyCost: isPrevMonthCostAvailable
              ? prevMonthCost
              : dailyCost
                ? dailyCost * moment().daysInMonth()
                : 0,
          };
          const isGlacierExist = await this.s3GlacierRepository.findByCondition(
            {
              where: {
                accountId,
                region,
                isActive: 1,
                vaultARN: glacierVaultDetails.VaultARN,
              },
            },
          );
          if (isGlacierExist) {
            await this.s3GlacierRepository.update(
              isGlacierExist.id,
              glacierVaultFields,
            );
          } else {
            const glacier = this.s3GlacierRepository.create(glacierVaultFields);
            await this.s3GlacierRepository.save(glacier);
          }
        }
      }
      this.logger.log(
        `completed Syncing S3 Glacier vaults for account:${data.accountId} region:${data.region}`,
      );
    } catch (error) {
      this.logger.log(
        `Error in syncing S3Glacier Details for account: ${data.accountId} region: ${data.region}: Error: ${error}`,
      );
    }
  }
}

import { Injectable, Logger } from '@nestjs/common';
import { ClientCredentials } from 'src/common/interfaces/awsClient.interface';
import { S3GlacierProps } from 'src/common/interfaces/s3Glacier.interface';
import { AwsUsageDetailsRepository } from 'src/infra/repositories/awsUsageDetails.repository';
import { S3GlacierRepository } from 'src/infra/repositories/s3Glacier.repository';
import { ClientConfigurationService } from 'src/libs/aws-sdk/clientConfiguration.service';
import { S3GlacierSdkService } from 'src/libs/aws-sdk/s3GlacierSdk.service';

@Injectable()
export class S3GlacierService {
  private readonly logger = new Logger(S3GlacierService.name);

  constructor(
    private readonly clientConfigurationService: ClientConfigurationService,
    private readonly awsUsageDetailsRepository: AwsUsageDetailsRepository,
    private readonly s3GlacierSdkService: S3GlacierSdkService,
    private readonly s3GlacierRepository: S3GlacierRepository,
  ) {}
  async fetchS3GlacierDetails(data: ClientCredentials) {
    try {
      this.logger.log(
        `s3Glacier details job STARTED for account: ${data.accountId} region: ${data.region}`,
      );
      const { accessKeyId, secretAccessKey, accountId, region } = data;
      const efsClient =
        await this.clientConfigurationService.getS3GlacierClient(data);
      const glacierList = await this.s3GlacierSdkService.listS3Glacier(
        efsClient,
        accountId,
      );
      if (glacierList && glacierList.length) {
        for (let i = 0; i < glacierList.length; i++) {
          const glacierVaultDetails = glacierList[i];
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
        `S3Glacier details job COMPLETED for account: ${data.accountId} region: ${data.region}`,
      );
    } catch (error) {
      this.logger.log(
        `Error in getting S3Glacier Details for account: ${data.accountId} region: ${data.region}: Error: ${error}`,
      );
    }
  }
}

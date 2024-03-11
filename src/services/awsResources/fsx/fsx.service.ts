import { Injectable, Logger } from '@nestjs/common';
import { ClientCredentials } from 'src/common/interfaces/awsClient.interface';
import { ClientConfigurationService } from 'src/libs/aws-sdk/clientConfiguration.service';
import { AwsHelperService } from '../helper/helper.service';
import { AwsUsageDetailsRepository } from 'src/infra/repositories/awsUsageDetails.repository';
import { FsxDetailsRepository } from 'src/infra/repositories/fsxDetailsRepository';
import { FsxSdkService } from 'src/libs/aws-sdk/fsxSdkService';
import { FsxFileSystemProps } from 'src/common/interfaces/fsx.interface';

@Injectable()
export class FsxService {
  private readonly logger = new Logger(FsxService.name);
  constructor(
    private readonly clientConfigurationService: ClientConfigurationService,
    private readonly fsxSdkService: FsxSdkService,
    private readonly awsUsageDetailsRepository: AwsUsageDetailsRepository,
    private readonly fsxDetailsRepository: FsxDetailsRepository,
  ) {}
  async fetchFsxDetails(data: ClientCredentials) {
    try {
      this.logger.log(
        `Fsx details job STARTED for account: ${data.accountId} region: ${data.region}`,
      );
      const { accessKeyId, secretAccessKeyId, accountId, region } = data;

      const fsxClient =
        await this.clientConfigurationService.getFsxClient(data);

      const fileSystems =
        await this.fsxSdkService.listFileSystems(fsxClient);

      if (fileSystems && fileSystems.length) {
        for (let i = 0; i < fileSystems.length; i++) {
          const fsxDetails = fileSystems[i];
          const name = fsxDetails.Tags.find(({ Key }) => Key === 'Name')?.Value;

          const currencyCode =
            await this.awsUsageDetailsRepository.getAwsCurrencyCode(accountId);
          const FsxFields: FsxFileSystemProps = {
            fileSystemId: fsxDetails.FileSystemId,
            resourceArn: fsxDetails.ResourceARN,
            storageOwner: fsxDetails.OwnerId,
            storageName: name,
            fileSystemType: fsxDetails.FileSystemType,
            createdOn: fsxDetails.CreationTime,
            storageType: fsxDetails.StorageType,
            status: fsxDetails.Lifecycle,
            region: region,
            vpcId: fsxDetails.VpcId,
            accountId: accountId,
            storageCapacity: fsxDetails.StorageCapacity,
            unit: 'GB',
            currencyCode:
              (currencyCode && currencyCode[0]?.billing_currency) || '',
          };
          const isFileSystemExist =
            await this.fsxDetailsRepository.findFsxFileSystem(FsxFields);

          if (isFileSystemExist) {
            await this.fsxDetailsRepository.updateFsxFileSystem(
              isFileSystemExist.id,
              FsxFields,
            );
          } else {
            await this.fsxDetailsRepository.createFsxFileSystem(FsxFields);
          }
          //   const tagResult = await syncAwsTag(
          //     accountId,
          //     INSTANCE_TYPE.FSx,
          //     region,
          //     FsxFields.Unit,
          //   );
        }
      }
      this.logger.log(
        `Fsx Details job COMPLETED for account: ${data.accountId} region: ${data.region}`,
      );
    } catch (error) {
      console.log(error);
      this.logger.log(
        `Error in getting Fsx Details for account: ${data.accountId} region: ${data.region}: Error: ${error}`,
      );
    }
  }
}

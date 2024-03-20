import { Injectable, Logger } from '@nestjs/common';
import { ClientCredentials } from 'src/common/interfaces/awsClient.interface';
import { ClientConfigurationService } from 'src/libs/aws-sdk/clientConfiguration.service';
import { AwsHelperService } from '../helper/helper.service';
import { AwsUsageDetailsRepository } from 'src/infra/repositories/awsUsageDetails.repository';
import { FsxDetailsRepository } from 'src/infra/repositories/fsxDetailsRepository';
import { FsxSdkService } from 'src/libs/aws-sdk/fsxSdkService';
import { FsxFileSystemProps } from 'src/common/interfaces/fsx.interface';

@Injectable()
export class FSxService {
  private readonly logger = new Logger(FSxService.name);
  constructor(
    private readonly clientConfigurationService: ClientConfigurationService,
    private readonly fsxSdkService: FsxSdkService,
    private readonly awsUsageDetailsRepository: AwsUsageDetailsRepository,
    private readonly fsxDetailsRepository: FsxDetailsRepository,
  ) {}
  async syncFSxFileSystem(data: ClientCredentials) {
    try {
      this.logger.log(
        `started Syncing FSx file system for account:${data.accountId} region:${data.region}`,
      );
      const { accessKeyId, secretAccessKey, accountId, region, currencyCode } =
        data;

      const fsxClient =
        await this.clientConfigurationService.getFsxClient(data);

      const fileSystems = await this.fsxSdkService.listFileSystems(fsxClient);

      if (fileSystems && fileSystems.length) {
        for (let i = 0; i < fileSystems.length; i++) {
          const fsxDetails = fileSystems[i];
          const name = fsxDetails.Tags.find(({ Key }) => Key === 'Name')?.Value;

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
            currencyCode: currencyCode,
          };
          const isFileSystemExist =
            await this.fsxDetailsRepository.findByCondition({
              where: {
                accountId,
                region,
                resourceARN: fsxDetails.ResourceARN,
                isActive: 1,
              },
            });

          if (isFileSystemExist) {
            await this.fsxDetailsRepository.update(
              isFileSystemExist.id,
              FsxFields,
            );
          } else {
            const fsx = this.fsxDetailsRepository.create(FsxFields);
            await this.fsxDetailsRepository.save(fsx);
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
        `completed Syncing FSx file system for account:${data.accountId} region:${data.region}`,
      );
    } catch (error) {
      this.logger.log(
        `Error in syncing FSx Details for account: ${data.accountId} region: ${data.region}: Error: ${error}`,
      );
    }
  }
}

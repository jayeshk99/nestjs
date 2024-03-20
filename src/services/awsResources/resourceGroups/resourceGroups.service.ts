import { Injectable, Logger } from '@nestjs/common';
import { LOOK_UP_EVENT, RESOURCE_TYPE } from 'src/common/constants/constants';
import { ClientCredentials } from 'src/common/interfaces/awsClient.interface';
import { ResourceGroupProps } from 'src/common/interfaces/resourceGroup.interface';
import { ResourceGroupRepository } from 'src/infra/repositories/resourceGroup.repository';
import { ClientConfigurationService } from 'src/libs/aws-sdk/clientConfiguration.service';
import { CloudTrailSdkService } from 'src/libs/aws-sdk/cloudTrailSdk.service';
import { ResourceGroupSdkService } from 'src/libs/aws-sdk/resourceGroupSdk.service';

@Injectable()
export class ResourceGroupService {
  private readonly logger = new Logger(ResourceGroupService.name);
  constructor(
    private readonly clientConfigurationService: ClientConfigurationService,
    private readonly resourceGroupSdkService: ResourceGroupSdkService,
    private readonly cloudTrailSdkService: CloudTrailSdkService,
    private readonly resourceGroupRepository: ResourceGroupRepository,
  ) {}
  async fetchResourceGroupDetails(data: ClientCredentials): Promise<void> {
    try {
      this.logger.log(
        `S3 details job STARTED for account: ${data.accountId} region: ${data.region}`,
      );
      const { accountId, accessKeyId, secretAccessKey, region, currencyCode } =
        data;
      const resourceGroupClient =
        await this.clientConfigurationService.getResourceGroupClient(data);
      const resourceGroupList =
        await this.resourceGroupSdkService.listResourceGroups(
          resourceGroupClient,
        );
      if (resourceGroupList && resourceGroupList.length) {
        const cloudTrailClient =
          await this.clientConfigurationService.getCloudTrailClient(data);
        for (let group = 0; group < resourceGroupList.length; group++) {
          const resourceGroup = resourceGroupList[group];
          const resourceGroupLastModified =
            await this.cloudTrailSdkService.getLatestEventHistory(
              cloudTrailClient,
              {
                LookupAttributes: [
                  {
                    AttributeKey: 'EventSource',
                    AttributeValue: LOOK_UP_EVENT.ResourceGroups,
                  },
                ],
              },
              resourceGroup.GroupName,
              RESOURCE_TYPE.AWS_RG,
            );
          const ResourceGroupFields: ResourceGroupProps = {
            resourceGroupName: resourceGroup.GroupName,
            region: region,
            resourceGroupArn: resourceGroup.GroupArn,
            lastModified: resourceGroupLastModified,
            accountId: accountId,
          };
          const resourceGroupExist =
            await this.resourceGroupRepository.findByCondition({
              where: {
                accountId,
                region,
                isActive: 1,
                resourceGroupArn: resourceGroup.GroupArn,
              },
            });
          if (resourceGroupExist) {
            await this.resourceGroupRepository.update(
              resourceGroupExist.id,
              ResourceGroupFields,
            );
          } else {
            const group =
              this.resourceGroupRepository.create(ResourceGroupFields);
            await this.resourceGroupRepository.save(group);
          }
        }
      }
    } catch (error) {
      this.logger.log(
        `error while syncing resource groups for account:${data.accountId} region:${data.region} error:${error}`,
      );
    }
  }
}

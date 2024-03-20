import { Injectable, Logger } from '@nestjs/common';
import { ClientCredentials } from 'src/common/interfaces/awsClient.interface';
import { ClientConfigurationService } from 'src/libs/aws-sdk/clientConfiguration.service';
import { AwsUsageDetailsRepository } from 'src/infra/repositories/awsUsageDetails.repository';
import {
  LOOK_UP_EVENT,
  PRODUCT_CODE,
  RESOURCE_TYPE,
} from 'src/common/constants/constants';
import { awsUsageCostProps } from 'src/common/interfaces/common.interfaces';

import {
  ECRProps,
  ecrCostDetailProps,
} from 'src/common/interfaces/ecrProps.interface';
import { AwsHelperService } from '../helper/helper.service';
import * as moment from 'moment';
import { ECSRepository } from 'src/infra/repositories/ecs.repository';
import { ECSSdkService } from 'src/libs/aws-sdk/ecsSdk.service';
import { CloudTrailSdkService } from 'src/libs/aws-sdk/cloudTrailSdk.service';
import { AwsContainerInstanceProps } from 'src/common/interfaces/ecs.interface';

@Injectable()
export class ECSService {
  private readonly logger = new Logger(ECSService.name);

  constructor(
    private readonly clientConfigurationService: ClientConfigurationService,
    private readonly awsUsageDetailsRepository: AwsUsageDetailsRepository,
    private readonly ecsRepository: ECSRepository,
    private readonly ecsSdkService: ECSSdkService,
    private readonly awsHelperService: AwsHelperService,
    private readonly cloudTrailSdkService: CloudTrailSdkService,
  ) {}
  async syncECSClusters(data: ClientCredentials) {
    try {
      this.logger.log(
        `started Syncing ECS clusters for account:${data.accountId} region:${data.region}`,
      );
      const { accessKeyId, secretAccessKey, accountId, region, currencyCode } =
        data;
      const cloudTrailClient =
        await this.clientConfigurationService.getCloudTrailClient(data);
      const ecsClient =
        await this.clientConfigurationService.getECSClient(data);
      const ecsList = await this.ecsSdkService.listEcsClusters(ecsClient);

      if (ecsList && ecsList.length) {
        for (let cluster of ecsList) {
          // List of the container instances in a cluster
          const containerList = await this.ecsSdkService.listEcsInstances(
            ecsClient,
            cluster,
          );
          if (containerList.length) {
            // description of the instances
            const containerInstances =
              await this.ecsSdkService.describeEcsInstance(
                ecsClient,
                cluster,
                containerList,
              );

            if (containerInstances.length) {
              for (let instance of containerInstances) {
                const arn = instance.containerInstanceArn;
                const instanceId = arn.slice(arn.lastIndexOf('/') + 1);
                let eventHistory =
                  await this.cloudTrailSdkService.getLatestEventHistory(
                    cloudTrailClient,
                    {
                      LookupAttributes: [
                        {
                          AttributeKey: 'EventSource',
                          AttributeValue: LOOK_UP_EVENT.ECS,
                        },
                      ],
                    },
                    instance.containerInstanceArn,
                    RESOURCE_TYPE.ECS,
                  );
                const { dailyCost, isPrevMonthCostAvailable, prevMonthCost } =
                  await this.awsHelperService.getCostDetails({
                    accountId,
                    productCode:
                      PRODUCT_CODE['Elastic Container Service Instance'],
                    resourceId: arn,
                  });

                const containerInstanceFields: AwsContainerInstanceProps = {
                  instanceId,
                  arn,
                  ec2InstanceId: instance.ec2InstanceId,
                  agentConnected: instance.agentConnected,
                  agentUpdateStatus: instance.agentUpdateStatus,
                  // Attachments: instance.attachments,
                  // Attributes: instance.attributes,
                  capacityProviderName: instance.capacityProviderName,
                  // PendingTasksCount: instance.pendingTasksCount,
                  registeredAt: instance.registeredAt,
                  // RegisteredResources: instance.registeredResources,
                  // RemainingResources: instance.remainingResources,
                  status: instance.status,
                  statusReason: instance.statusReason,
                  lastModified: new Date(eventHistory),
                  version: instance.version.toString(),
                  // VersionInfo: instance.versionInfo,
                  accountId: accountId,
                  region: region,
                  agentVersion: instance.versionInfo?.agentVersion,
                  monthlyCost: isPrevMonthCostAvailable
                    ? prevMonthCost
                    : dailyCost * moment().daysInMonth() || 0,
                  currencyCode: currencyCode,
                };
                const isEcsExist = await this.ecsRepository.findByCondition({
                  where: { accountId, instanceId, isActive: 1 },
                });
                if (isEcsExist) {
                  await this.ecsRepository.update(
                    isEcsExist.id,
                    containerInstanceFields,
                  );
                } else {
                  const ecsEntity = this.ecsRepository.create(
                    containerInstanceFields,
                  );
                  await this.ecsRepository.save(ecsEntity);
                }
              }
            }
          }
        }
      }
      this.logger.log(
        `completed Syncing ECS clusters for account:${data.accountId} region:${data.region}`,
      );
    } catch (error) {
      this.logger.log(
        `Error in syncing ECS Details for account: ${data.accountId} region: ${data.region}: Error: ${error}`,
      );
    }
  }
}

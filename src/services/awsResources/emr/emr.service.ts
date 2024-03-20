import { Injectable, Logger } from '@nestjs/common';
import { ClientCredentials } from 'src/common/interfaces/awsClient.interface';
import { ClientConfigurationService } from 'src/libs/aws-sdk/clientConfiguration.service';
import { AwsHelperService } from '../helper/helper.service';
import { AwsUsageDetailsRepository } from 'src/infra/repositories/awsUsageDetails.repository';
import { FsxDetailsRepository } from 'src/infra/repositories/fsxDetailsRepository';
import { FsxSdkService } from 'src/libs/aws-sdk/fsxSdkService';
import { FsxFileSystemProps } from 'src/common/interfaces/fsx.interface';
import { EMRSdkService } from 'src/libs/aws-sdk/emr.sdk.service';
import { EMRRepository } from 'src/infra/repositories/emr.repository';
import { CloudTrailSdkService } from 'src/libs/aws-sdk/cloudTrailSdk.service';
import {
  LOOK_UP_EVENT,
  PRODUCT_CODE,
  RESOURCE_TYPE,
} from 'src/common/constants/constants';
import { EMRProps } from 'src/common/interfaces/emr.interface';
import moment from 'moment';

@Injectable()
export class EMRService {
  private readonly logger = new Logger(EMRService.name);
  constructor(
    private readonly clientConfigurationService: ClientConfigurationService,
    private readonly emrSdkService: EMRSdkService,
    private readonly awsUsageDetailsRepository: AwsUsageDetailsRepository,
    private readonly awsHelperService: AwsHelperService,
    private readonly emrRepository: EMRRepository,
    private readonly cloudTrailSdkService: CloudTrailSdkService,
  ) {}
  async syncEMRClusters(data: ClientCredentials) {
    try {
      this.logger.log(
        `started Syncing EMR clusters for account:${data.accountId} region:${data.region}`,
      );
      const { accessKeyId, secretAccessKey, accountId, region, currencyCode } =
        data;
      const cloudtrailClient =
        await this.clientConfigurationService.getCloudTrailClient(data);
      const emrClient =
        await this.clientConfigurationService.getEMRClient(data);

      const clusters = await this.emrSdkService.listEMRClusters(emrClient);

      if (clusters && clusters.length) {
        for (let cluster of clusters) {
          /*
             this end time date tells when the cluster was terminated
             if the date is void then cluster is not terminated and we can sync
        */
          const endDateTime =
            cluster?.Status && cluster.Status.Timeline?.EndDateTime;
          if (endDateTime === void 0) {
            const clusterDesc = await this.emrSdkService.describeEMRCluster(
              emrClient,
              cluster.Id,
            );
            if (clusterDesc) {
              const eventHistory =
                await this.cloudTrailSdkService.getLatestEventHistory(
                  cloudtrailClient,
                  {
                    LookupAttributes: [
                      {
                        AttributeKey: 'EventSource',
                        AttributeValue: LOOK_UP_EVENT.EMR,
                      },
                    ],
                  },
                  cluster.Id,
                  RESOURCE_TYPE.EMR,
                );
              const { dailyCost, isPrevMonthCostAvailable, prevMonthCost } =
                await this.awsHelperService.getCostDetails({
                  resourceId: clusterDesc.Id,
                  accountId: accountId,
                  productCode: PRODUCT_CODE.EMR,
                });
              const emrFields: EMRProps = {
                clusterArn: clusterDesc.ClusterArn,
                clusterId: clusterDesc.Id,
                instanceCollectionType: clusterDesc.InstanceCollectionType,
                autoTerminate: clusterDesc.AutoTerminate.toString(),
                serviceRole: clusterDesc.ServiceRole,
                releaseLabel: clusterDesc.ReleaseLabel,
                applications:
                  clusterDesc.Applications &&
                  clusterDesc.Applications.map(
                    (item) => `${item?.Name}(${item?.Version})`,
                  ).join(', '),
                state: clusterDesc.Status && clusterDesc.Status?.State,
                createdOn:
                  clusterDesc.Status &&
                  clusterDesc.Status?.Timeline &&
                  clusterDesc.Status.Timeline?.CreationDateTime,
                visibleToAllUsers: clusterDesc.VisibleToAllUsers.toString(),
                lastModified: new Date(eventHistory),
                accountId: accountId,
                region: region,
                monthlyCost: isPrevMonthCostAvailable
                  ? prevMonthCost
                  : dailyCost * moment().daysInMonth() || 0,
                currencyCode: currencyCode,
              };

              const isEmrExist = await this.emrRepository.findByCondition({
                where: {
                  accountId: emrFields.accountId,
                  clusterArn: emrFields.clusterArn,
                  isActive: 1,
                },
              });
              if (isEmrExist) {
                await this.emrRepository.update(isEmrExist.id, emrFields);
              } else {
                const elbEntity = this.emrRepository.create(emrFields);
                await this.emrRepository.save(elbEntity);
              }
            }
          }
        }
      }
      this.logger.log(
        `completed Syncing EMR clusters for account:${data.accountId} region:${data.region}`,
      );
    } catch (error) {
      this.logger.log(
        `Error in syncing EMR Details for account: ${data.accountId} region: ${data.region}: Error: ${error}`,
      );
    }
  }
}

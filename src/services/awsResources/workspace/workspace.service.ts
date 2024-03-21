import { Injectable, Logger } from '@nestjs/common';
import { ClientCredentials } from 'src/common/interfaces/awsClient.interface';
import { ClientConfigurationService } from 'src/libs/aws-sdk/clientConfiguration.service';
import { AwsHelperService } from '../helper/helper.service';
import { AwsUsageDetailsRepository } from 'src/infra/repositories/awsUsageDetails.repository';
import {
  LOOK_UP_EVENT,
  PRODUCT_CODE,
  RESOURCE_TYPE,
} from 'src/common/constants/constants';
import { EMRProps } from 'src/common/interfaces/emr.interface';
import moment from 'moment';
import { DynamoDBSdkService } from 'src/libs/aws-sdk/dynamoDbSdk.service';
import { DynamoDBRepository } from 'src/infra/repositories/dynamoDb.repository';
import { DynamoDBDetailEntity } from 'src/infra/entities/dynamoDbDetails.entity';
import { AWSWorkspaceSdkService } from 'src/libs/aws-sdk/workspaceSdk.service';
import { AWSWorkspaceRepository } from 'src/infra/repositories/awsWorkspace.repository';
import { AWSWorkspaceEntity } from 'src/infra/entities/workspaceDetails.entity';

@Injectable()
export class AWSWorkspaceService {
  private readonly logger = new Logger(AWSWorkspaceService.name);
  constructor(
    private readonly clientConfigurationService: ClientConfigurationService,
    private readonly awsWorkspaceSdkService: AWSWorkspaceSdkService,
    private readonly awsUsageDetailsRepository: AwsUsageDetailsRepository,
    private readonly awsHelperService: AwsHelperService,
    private readonly awsWorkspaceRepository: AWSWorkspaceRepository,
  ) {}
  async fetchWorkspaceDetails(data: ClientCredentials) {
    try {
      this.logger.log(
        `AWS Workspace details job STARTED for account: ${data.accountId} region: ${data.region}`,
      );
      const { accessKeyId, secretAccessKey, accountId, region, currencyCode } =
        data;
      const workspaceClient =
        await this.clientConfigurationService.getWorkspaceClient(data);

      const workspaces =
        await this.awsWorkspaceSdkService.listWorkspaces(workspaceClient);

      if (workspaces && workspaces.length) {
        for (let workspace of workspaces) {
          const workspaceConnectionStatus =
            await this.awsWorkspaceSdkService.describeWorkspaceConnection(
              workspaceClient,
              workspace.WorkspaceId,
            );
          const workspaceArn = `arn:aws:workspaces:${region}:${accountId}:workspace/${workspace.WorkspaceId}`;
          const UserLastActive =
            workspaceConnectionStatus[0].LastKnownUserConnectionTimestamp;
          const { dailyCost, isPrevMonthCostAvailable, prevMonthCost } =
            await this.awsHelperService.getCostDetails({
              resourceId: workspaceArn,
              accountId: accountId,
              productCode: PRODUCT_CODE.Workspaces,
            });
          const workspaceFields: Partial<AWSWorkspaceEntity> = {
            workspaceId: workspace && workspace.WorkspaceId,
            computerName: workspace && workspace.ComputerName,
            ipAddress: workspace && workspace.IpAddress,
            workspaceState: workspace && workspace.State,
            userName: workspace && workspace.UserName,
            accountId: accountId,
            userLastActive: UserLastActive ? new Date(UserLastActive) : null,
            region: region,
            monthlyCost: isPrevMonthCostAvailable
              ? prevMonthCost
              : dailyCost * moment().daysInMonth() || 0,
            currencyCode: currencyCode,
          };

          const isworkspaceExist =
            await this.awsWorkspaceRepository.findByCondition({
              where: {
                accountId: workspaceFields.accountId,
                workspaceArn: workspaceFields.workspaceArn,
                isActive: 1,
              },
            });
          if (isworkspaceExist) {
            await this.awsWorkspaceRepository.update(
              isworkspaceExist.id,
              workspaceFields,
            );
          } else {
            const workspaceEntity =
              this.awsWorkspaceRepository.create(workspaceFields);
            await this.awsWorkspaceRepository.save(workspaceEntity);
          }
        }
      }
      this.logger.log(
        `AWS Workspace Details job COMPLETED for account: ${data.accountId} region: ${data.region}`,
      );
    } catch (error) {
      this.logger.log(
        `Error in getting AWS Workspace Details for account: ${data.accountId} region: ${data.region}: Error: ${error}`,
      );
    }
  }
}

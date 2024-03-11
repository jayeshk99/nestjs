import { Injectable, Logger } from '@nestjs/common';
import { ClientCredentials } from 'src/common/interfaces/awsClient.interface';
import { ClientConfigurationService } from 'src/libs/aws-sdk/clientConfiguration.service';
import { RdsSdkService } from 'src/libs/aws-sdk/rdsSdk.service';
import { AwsHelperModule } from '../helper/helper.module';
import { AwsHelperService } from '../helper/helper.service';
import { AwsUsageDetailsRepository } from 'src/infra/repositories/awsUsageDetails.repository';
import { PRODUCT_CODE } from 'src/common/constants/constants';
import { RDSInstanceProps, RdsCostDetailProps } from 'src/common/interfaces/rds.interface';
import { awsUsageCostProps } from 'src/common/interfaces/common.interfaces';
import { RdsDetailsRepository } from 'src/infra/repositories/rdsDetails.repositories';

@Injectable()
export class RdsService {
  private readonly logger = new Logger(RdsService.name);
  constructor(
    private readonly clientConfigurationService: ClientConfigurationService,
    private readonly rdsSdkService: RdsSdkService,
    private readonly awsHelperService: AwsHelperService,
    private readonly awsUsageDetailsRepository:AwsUsageDetailsRepository,
    private readonly rdsDetailsRepository: RdsDetailsRepository
  ) {}

  async fetchRdsDetails(data: ClientCredentials) {
    try {
      this.logger.log(
        `Fsx details job STARTED for account: ${data.accountId} region: ${data.region}`,
      );
      const { accessKeyId, secretAccessKeyId, accountId, region } = data;

      const rdsClient =
        await this.clientConfigurationService.getRdsClient(data);
      const rdsInstancesList =
        await this.rdsSdkService.listInstances(rdsClient);

      if (rdsInstancesList && rdsInstancesList.length) {
        const cloudWatchClient =
          await this.clientConfigurationService.getCloudWatchClient(data);
        for (let instance = 0; instance < rdsInstancesList.length; instance++) {
            const dbInstance=rdsInstancesList[instance]
          let {
            CPUUtilization,
            DatabaseConnections,
            ReadIOPS,
            WriteIOPS,
            NetworkReceiveThroughput,
            NetworkTransmitThroughput,
          } = await this.awsHelperService.getRDSUtilizationData(
            cloudWatchClient,
            dbInstance.DBClusterIdentifier,
            new Date(Date.now() - 3600000 * 24),
            new Date(),
          );

          CPUUtilization = CPUUtilization.map((cpu) => {
            return {
              ...cpu,
              InstanceName: dbInstance.DBClusterIdentifier,
              AccountId: accountId,
            };
          });
          let avgReadIOPS = ReadIOPS.map(({ Average }) => Average);
          let avgWriteIOPS = WriteIOPS.map(({ Average }) => Average);
          let avgDBConnections = DatabaseConnections.map(
            ({ Average }) => Average,
          );
          const { currencyCode, rdsPerDayCost, storagePrevMonthCost } =
            await this.rdsCostDetails({
              rdsInstanceArn: dbInstance.DBInstanceArn,
              accountId: accountId,
            });

            const dbParameterGroupNames =
            dbInstance.DBParameterGroups.length &&
            dbInstance.DBParameterGroups.map(
              (group) => group.DBParameterGroupName
            );
          const optionGroupMemebershipNames =
            dbInstance.OptionGroupMemberships.length &&
            dbInstance.OptionGroupMemberships.map(
              (group) => group.OptionGroupName
            );
          const DBInstanceFields: RDSInstanceProps = {
            dbInstanceIdentifier: dbInstance.DBInstanceIdentifier,
            dbInstanceClass: dbInstance.DBInstanceClass,
            engine: dbInstance.Engine,
            dbName: dbInstance.DBName,
            allocatedStorage: dbInstance.AllocatedStorage,
            engineVersion: dbInstance.EngineVersion,
            createdOn: dbInstance.InstanceCreateTime,
            storageType: dbInstance.StorageType,
            dbInstanceArn: dbInstance.DBInstanceArn,
            readIOPSAvgMax: Math.max(...avgReadIOPS) || 0,
            writeIOPSAvgMax: Math.max(...avgWriteIOPS) || 0,
            dbConnectionsAvgMax: Math.max(...avgDBConnections) || 0,
            region: region,
            accountId: accountId,
            monthlyCost:
              (rdsPerDayCost && parseFloat(rdsPerDayCost.toFixed(2))) || 0,
            currencyCode:
              (currencyCode && currencyCode[0]?.billing_currency) || "",
            instanceStatus: dbInstance.DBInstanceStatus,
            databaseEndpoint: dbInstance.Endpoint.Address,
            databasePort: dbInstance.Endpoint.Port,
            backupWindow: dbInstance.PreferredBackupWindow,
            backupRetentionPeriod: dbInstance.BackupRetentionPeriod,
            // SecurityGroups: '',
            dbParameterGroups: dbParameterGroupNames.join(","),
            availabilityZone: dbInstance.AvailabilityZone,
            vPCId: dbInstance.DBSubnetGroup.VpcId,
            multiAZ: dbInstance.MultiAZ,
            optionGroupMemberships: optionGroupMemebershipNames.join(","),
            associatedRoles:
              dbInstance.AssociatedRoles.length &&
              JSON.stringify(dbInstance.AssociatedRoles.length),
            storageEncrypted: dbInstance.StorageEncrypted,
            deletionProtection: dbInstance.DeletionProtection,
          };
          const isBucketExist =
          await this.rdsDetailsRepository.findDBInstance(DBInstanceFields);
        if (isBucketExist) {
          await this.rdsDetailsRepository.updateDBInstance(
            isBucketExist.id,
            DBInstanceFields,
          );
        } else {
          await this.rdsDetailsRepository.createDBInstance(DBInstanceFields);
        }

        }
      }
    } catch (error) {}
  }
  async rdsCostDetails(data: RdsCostDetailProps) {
    try {
      const { rdsInstanceArn, accountId } = data;
      const s3UsageDetails =
        await this.awsUsageDetailsRepository.getOneDayCostOfResource({
          resourceId: rdsInstanceArn,
          productCode: PRODUCT_CODE.RDS,
          awsAccountId: accountId,
        });

      const currencyCode =
        await this.awsUsageDetailsRepository.getAwsCurrencyCode(accountId);

      const rdsPerDayCost = s3UsageDetails && s3UsageDetails.unBlendedCost;

      const currentDate = new Date().toISOString().split('T')[0];
      const currentBillDate = new Date(currentDate);
      const startDate = new Date(
        currentBillDate.setDate(currentBillDate.getDate() - 29),
      )
        .toISOString()
        .split('T')[0];

      const usageCostFields: awsUsageCostProps = {
        resourceId: rdsInstanceArn,
        prouductCode: PRODUCT_CODE.RDS,
        startTime: startDate,
        endTime: currentDate,
        awsAccountId: accountId,
      };

      const storageMonthlyCost =
        await this.awsUsageDetailsRepository.getAwsStorageUsageCost(
          usageCostFields,
        );
      const storagePrevMonthCost: number = storageMonthlyCost?.costSum;
      return { currencyCode, rdsPerDayCost, storagePrevMonthCost };
    } catch (error) {
      this.logger.log(
        `Error in getting cost details for s3 for account: ${data.accountId} ${error}`,
      );
    }
  }
}

import { Injectable, Logger } from '@nestjs/common';
import { ClientCredentials } from 'src/common/interfaces/awsClient.interface';
import { ClientConfigurationService } from 'src/libs/aws-sdk/clientConfiguration.service';
import { RdsSdkService } from 'src/libs/aws-sdk/rdsSdk.service';
import { AwsHelperModule } from '../helper/helper.module';
import { AwsHelperService } from '../helper/helper.service';
import { AwsUsageDetailsRepository } from 'src/infra/repositories/awsUsageDetails.repository';
import { PRODUCT_CODE } from 'src/common/constants/constants';
import {
  RDSInstanceProps,
  RdsCostDetailProps,
} from 'src/common/interfaces/rds.interface';
import { awsUsageCostProps } from 'src/common/interfaces/common.interfaces';
import { RdsDetailsRepository } from 'src/infra/repositories/rdsDetails.repositories';
import { group } from 'console';
import * as moment from 'moment';
import { RdsUtilizationRepository } from 'src/infra/repositories/rdsUtilizationRepository';

@Injectable()
export class RdsService {
  private readonly logger = new Logger(RdsService.name);
  constructor(
    private readonly clientConfigurationService: ClientConfigurationService,
    private readonly rdsSdkService: RdsSdkService,
    private readonly awsHelperService: AwsHelperService,
    private readonly awsUsageDetailsRepository: AwsUsageDetailsRepository,
    private readonly rdsDetailsRepository: RdsDetailsRepository,
    private readonly rdsUtilizationRepository: RdsUtilizationRepository,
  ) {}

  async fetchRdsDetails(data: ClientCredentials) {
    try {
      this.logger.log(
        `Fsx details job STARTED for account: ${data.accountId} region: ${data.region}`,
      );
      const { accessKeyId, secretAccessKey, accountId, region } = data;

      const rdsClient =
        await this.clientConfigurationService.getRdsClient(data);
      const rdsInstancesList =
        await this.rdsSdkService.listRdsInstances(rdsClient);

      if (rdsInstancesList && rdsInstancesList.length) {
        const currencyCode =
          await this.awsUsageDetailsRepository.getAwsCurrencyCode(accountId);
        const cloudWatchClient =
          await this.clientConfigurationService.getCloudWatchClient(data);
        const startTime = new Date(
          moment().subtract(1, 'day').format('YYYY-MM-DD HH:mm'),
        );
        const endTime = new Date();
        for (let instance = 0; instance < rdsInstancesList.length; instance++) {
          const dbInstance = rdsInstancesList[instance];
          let {
            CPUUtilization,
            DatabaseConnections,
            ReadIOPS,
            WriteIOPS,
            NetworkReceiveThroughput,
            NetworkTransmitThroughput,
          } = await this.awsHelperService.getRDSUtilizationData(
            cloudWatchClient,
            dbInstance.DBInstanceIdentifier,
            startTime,
            endTime,
          );
          let CPUUtilizationData = this.awsHelperService.mapUtilizationData(
            CPUUtilization,
            dbInstance.DBInstanceIdentifier,
            accountId,
            'CPUUtilization',
          );

          let DatabaseConnectionData = this.awsHelperService.mapUtilizationData(
            DatabaseConnections,
            dbInstance.DBInstanceIdentifier,
            accountId,
            'DatabaseConnections',
          );
          let WriteIOPSData = this.awsHelperService.mapUtilizationData(
            WriteIOPS,
            dbInstance.DBInstanceIdentifier,
            accountId,
            'WriteIOPS',
          );

          let ReadIOPSData = this.awsHelperService.mapUtilizationData(
            ReadIOPS,
            dbInstance.DBInstanceIdentifier,
            accountId,
            'ReadIOPS',
          );
          let NetworkReceiveThroughputData =
            this.awsHelperService.mapUtilizationData(
              NetworkReceiveThroughput,
              dbInstance.DBInstanceIdentifier,
              accountId,
              'NetworkReceiveThroughput',
            );
          let NetworkTransmitThroughputData =
            this.awsHelperService.mapUtilizationData(
              NetworkTransmitThroughput,
              dbInstance.DBInstanceIdentifier,
              accountId,
              'NetworkTransmitThroughput',
            );

          let avgReadIOPS = ReadIOPS.map(({ Average }) => Average);
          let avgWriteIOPS = WriteIOPS.map(({ Average }) => Average);
          let avgDBConnections = DatabaseConnections.map(
            ({ Average }) => Average,
          );
          const { dailyCost, isPrevMonthCostAvailable, prevMonthCost } =
            await this.awsHelperService.getCostDetails({
              resourceId: dbInstance.DBInstanceArn,
              accountId: accountId,
              productName: 'RDS',
            });

          if (CPUUtilizationData.length) {
            await this.rdsUtilizationRepository.deleteDuplicateUtilizationData({
              accountId: accountId,
              dbInstanceIdentifier: dbInstance.DBInstanceIdentifier,
              metricName: 'CPUUtilization',
              startTime,
              endTime,
            });
            await this.rdsUtilizationRepository.addUtilizationData(
              CPUUtilizationData,
            );
          }
          if (DatabaseConnectionData.length) {
          }
          if (WriteIOPSData.length) {
          }
          if (ReadIOPSData.length) {
          }
          if (NetworkReceiveThroughputData.length) {
          }
          if (NetworkTransmitThroughputData.length) {
          }

          const DBInstanceFields: RDSInstanceProps = {
            accountId: accountId,
            dbName: dbInstance.DBName,
            dbInstanceIdentifier: dbInstance.DBInstanceIdentifier,
            dbInstanceClass: dbInstance.DBInstanceClass,
            engine: dbInstance.Engine,
            allocatedStorage: dbInstance.AllocatedStorage,
            dbInstanceArn: dbInstance.DBInstanceArn,
            engineVersion: dbInstance.EngineVersion,
            readIOPSAvgMax: Math.max(...avgReadIOPS) || 0,
            writeIOPSAvgMax: Math.max(...avgWriteIOPS) || 0,
            dbConnectionsAvgMax: Math.max(...avgDBConnections) || 0,
            storageType: dbInstance.StorageType,
            createdOn: dbInstance.InstanceCreateTime,
            region: region,
            currencyCode: currencyCode,
            monthlyCost: isPrevMonthCostAvailable
              ? prevMonthCost
              : dailyCost
                ? dailyCost * moment().daysInMonth()
                : 0,
            instanceStatus: dbInstance.DBInstanceStatus,
            databaseEndpoint: dbInstance.Endpoint?.Address,
            databasePort: dbInstance.Endpoint?.Port,
            backupWindow: dbInstance.PreferredBackupWindow,
            backupRetentionPeriod: dbInstance.BackupRetentionPeriod,
            dbParameterGroups: dbInstance.DBParameterGroups?.map(
              (group) => group.DBParameterGroupName,
            )?.join(','),
            availabilityZone: dbInstance.AvailabilityZone,
            vpcId: dbInstance.DBSubnetGroup?.VpcId,
            multiAZ: dbInstance.MultiAZ,
            optionGroupMemberships: dbInstance.OptionGroupMemberships?.map(
              (group) => group.OptionGroupName,
            )?.join(','),
            associatedRoles: dbInstance.AssociatedRoles?.toString(),
            storageEncrypted: dbInstance.StorageEncrypted,
            deletionProtection: dbInstance.DeletionProtection,
            // /* some other properties*/
          };
          console.log(DBInstanceFields);
          // const dbInstanceExist =
          // await this.rdsDetailsRepository.findDBInstance(DBInstanceFields);
          // if (dbInstanceExist) {
          //   await this.rdsDetailsRepository.updateDBInstance(
          //     dbInstanceExist.id,
          //     DBInstanceFields,
          //   );
          // } else {
          //   await this.rdsDetailsRepository.createDBInstance(DBInstanceFields);
          // }
        }
      }
    } catch (error) {
      this.logger.log(
        `Error in RDS resource sync job for account: ${data.accountId} region: ${data.region} ${error}`,
      );
    }
  }

  async fetchRdsUtilizationData(accountId: string): Promise<void> {
    try {
      this.logger.log(
        `Rds utilization data syncing  started for: ${accountId}`,
      );
      const activeRdsInstances =
        await this.rdsDetailsRepository.findAllActiveDBInstances({
          accountId,
        });
    } catch (error) {
      this.logger.log(
        `Error while fetching Rds Utilization Data for: ${accountId} error: ${error.message}`,
      );
    }
  }
}

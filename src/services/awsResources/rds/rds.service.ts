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
import moment from 'moment';

@Injectable()
export class RdsService {
  private readonly logger = new Logger(RdsService.name);
  constructor(
    private readonly clientConfigurationService: ClientConfigurationService,
    private readonly rdsSdkService: RdsSdkService,
    private readonly awsHelperService: AwsHelperService,
    private readonly awsUsageDetailsRepository: AwsUsageDetailsRepository,
    private readonly rdsDetailsRepository: RdsDetailsRepository,
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
          const { dailyCost, isPrevMonthCostAvailable, prevMonthCost } =
            await this.awsHelperService.getCostDetails({
              resourceId: dbInstance.DBInstanceArn,
              accountId: accountId,
              productName: 'RDS',
            });
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
    } catch (error) {}
  }
}

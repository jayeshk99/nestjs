import { Injectable, Logger } from '@nestjs/common';
import { ClientCredentials } from 'src/common/interfaces/awsClient.interface';
import { ClientConfigurationService } from 'src/libs/aws-sdk/clientConfiguration.service';
import { RdsSdkService } from 'src/libs/aws-sdk/rdsSdk.service';
import { AwsHelperService } from '../helper/helper.service';
import { AwsUsageDetailsRepository } from 'src/infra/repositories/awsUsageDetails.repository';
import { RDSInstanceProps } from 'src/common/interfaces/rds.interface';
import { RdsDetailsRepository } from 'src/infra/repositories/rdsDetails.repositories';
import * as moment from 'moment';
import { PRODUCT_CODE } from 'src/common/constants/constants';

@Injectable()
export class RDSService {
  private readonly logger = new Logger(RDSService.name);
  constructor(
    private readonly clientConfigurationService: ClientConfigurationService,
    private readonly rdsSdkService: RdsSdkService,
    private readonly awsHelperService: AwsHelperService,
    private readonly awsUsageDetailsRepository: AwsUsageDetailsRepository,
    private readonly rdsDetailsRepository: RdsDetailsRepository,
  ) {}

  async syncRDSDBInstances(data: ClientCredentials) {
    try {
      this.logger.log(
        `started Syncing RDS db instances for account:${data.accountId} region:${data.region}`,
      );
      const { accessKeyId, secretAccessKey, accountId, region, currencyCode } =
        data;

      const rdsClient =
        await this.clientConfigurationService.getRDSClient(data);
      const rdsInstancesList =
        await this.rdsSdkService.listRdsInstances(rdsClient);

      if (rdsInstancesList && rdsInstancesList.length) {
        for (let instance = 0; instance < rdsInstancesList.length; instance++) {
          const dbInstance = rdsInstancesList[instance];
          const { dailyCost, isPrevMonthCostAvailable, prevMonthCost } =
            await this.awsHelperService.getCostDetails({
              resourceId: dbInstance.DBInstanceArn,
              accountId: accountId,
              productCode: PRODUCT_CODE.RDS,
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
          };
          const dbInstanceExist =
            await this.rdsDetailsRepository.findByCondition({
              where: {
                accountId,
                region,
                dbInstanceArn: dbInstance.DBInstanceArn,
                isActive: 1,
              },
            });
          if (dbInstanceExist) {
            await this.rdsDetailsRepository.update(
              dbInstanceExist.id,
              DBInstanceFields,
            );
          } else {
            const rds = this.rdsDetailsRepository.create(DBInstanceFields);
            await this.rdsDetailsRepository.save(rds);
          }
        }
      }
      this.logger.log(
        `completed Syncing RDS db Instances for account:${data.accountId} region:${data.region}`,
      );
    } catch (error) {
      this.logger.log(
        `Error in syncing RDS db instances for account: ${data.accountId} region: ${data.region} ${error}`,
      );
    }
  }
}

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

@Injectable()
export class DynamoDBService {
  private readonly logger = new Logger(DynamoDBService.name);
  constructor(
    private readonly clientConfigurationService: ClientConfigurationService,
    private readonly dynamoDbSdkService: DynamoDBSdkService,
    private readonly awsUsageDetailsRepository: AwsUsageDetailsRepository,
    private readonly awsHelperService: AwsHelperService,
    private readonly dynamoDbRepository: DynamoDBRepository,
  ) {}
  async fetchDynamoDbDetails(data: ClientCredentials) {
    try {
      this.logger.log(
        `DynamoDB details job STARTED for account: ${data.accountId} region: ${data.region}`,
      );
      const { accessKeyId, secretAccessKey, accountId, region, currencyCode } =
        data;
      const dynamoDbClient =
        await this.clientConfigurationService.getDynamoDbClient(data);

      const tables = await this.dynamoDbSdkService.listDynamoDb(dynamoDbClient);

      if (tables && tables.length) {
        for (let table of tables) {
          const tableDesc = await this.dynamoDbSdkService.describeTable(
            dynamoDbClient,
            table,
          );
          if (tableDesc) {
            const { dailyCost, isPrevMonthCostAvailable, prevMonthCost } =
              await this.awsHelperService.getCostDetails({
                resourceId: tableDesc.TableArn,
                accountId: accountId,
                productCode: PRODUCT_CODE.DynamoDB,
              });
            const dynamoDbFields: Partial<DynamoDBDetailEntity> = {
              dynamoDBName: tableDesc.TableName,
              dynamoDBId: tableDesc.TableId,
              dynamoDBArn: tableDesc.TableArn,
              region: region,
              itemCount: tableDesc.ItemCount,
              size: tableDesc.TableSizeBytes,
              status: tableDesc.TableStatus,
              createdOn: tableDesc.CreationDateTime,
              accountId: accountId,
              unit: 'Byte',
              monthlyCost: isPrevMonthCostAvailable
                ? prevMonthCost
                : dailyCost * moment().daysInMonth() || 0,
              currencyCode: currencyCode,
            };

            const isdynamoDbExist =
              await this.dynamoDbRepository.findByCondition({
                where: {
                  accountId: dynamoDbFields.accountId,
                  dynamoDBArn: dynamoDbFields.dynamoDBArn,
                  isActive: 1,
                },
              });
            if (isdynamoDbExist) {
              await this.dynamoDbRepository.update(
                isdynamoDbExist.id,
                dynamoDbFields,
              );
            } else {
              const dynamoDbEntity =
                this.dynamoDbRepository.create(dynamoDbFields);
              await this.dynamoDbRepository.save(dynamoDbEntity);
            }
          }
        }
      }
      this.logger.log(
        `DynamoDB Details job COMPLETED for account: ${data.accountId} region: ${data.region}`,
      );
    } catch (error) {
      this.logger.log(
        `Error in getting DynamoDB Details for account: ${data.accountId} region: ${data.region}: Error: ${error}`,
      );
    }
  }
}

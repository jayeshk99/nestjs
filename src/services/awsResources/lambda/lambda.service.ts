import { Injectable, Logger } from '@nestjs/common';
import { ClientCredentials } from 'src/common/interfaces/awsClient.interface';
import { AwsLambdaSdkService } from 'src/libs/aws-sdk/awsLambdaSdk.service';
import { ClientConfigurationService } from 'src/libs/aws-sdk/clientConfiguration.service';
import { AwsHelperService } from '../helper/helper.service';
import { PRODUCT_CODE } from 'src/common/constants/constants';
import { LambdaDetailsEntity } from 'src/infra/entities/lambdaDetails.entity';
import * as moment from 'moment';
import { LambdaDetailsRepository } from 'src/infra/repositories/lambda.repository';

@Injectable()
export class LambdaService {
  private readonly logger = new Logger(LambdaService.name);
  constructor(
    private readonly clientConfigurationService: ClientConfigurationService,
    private readonly lambdaSdkService: AwsLambdaSdkService,
    private readonly awsHelperService: AwsHelperService,
    private readonly lambdaDetailsRepository: LambdaDetailsRepository,
  ) {}
  async syncLambdaFunctions(data: ClientCredentials) {
    try {
      this.logger.log(
        `started Syncing lambda functions for account:${data.accountId} region:${data.region}`,
      );
      const { accessKeyId, secretAccessKey, accountId, region, currencyCode } =
        data;
      const lambdaClient =
        await this.clientConfigurationService.getLambdaClient(data);
      const functionList =
        await this.lambdaSdkService.listFunctions(lambdaClient);
      if (functionList.length) {
        for (let i = 0; i < functionList.length; i++) {
          const functionDetails = functionList[i];
          const { dailyCost, isPrevMonthCostAvailable, prevMonthCost } =
            await this.awsHelperService.getCostDetails({
              resourceId: functionDetails.FunctionArn,
              accountId: accountId,
              productCode: PRODUCT_CODE.Lambda,
            });
          const functionFields: Partial<LambdaDetailsEntity> = {
            accountId: accountId,
            functionName: functionDetails.FunctionName,
            functionArn: functionDetails.FunctionArn,
            createdOn: new Date(),
            region: region,
            lastUpdated: new Date(functionDetails.LastModified),
            monthlyCost: isPrevMonthCostAvailable
              ? prevMonthCost
              : dailyCost * moment().daysInMonth() || 0,

            currencyCode: currencyCode,
            isActive: 1,
          };
          const doesFunctionExists =
            await this.lambdaDetailsRepository.findByCondition({
              where: {
                accountId,
                region,
                isActive: 1,
                functionArn: functionDetails.FunctionArn,
              },
            });

          if (doesFunctionExists) {
            delete functionFields.createdOn;
            await this.lambdaDetailsRepository.update(doesFunctionExists.id, {
              ...functionFields,
            });
          } else {
            const fun = this.lambdaDetailsRepository.create(functionFields);
            await this.lambdaDetailsRepository.save(fun);
          }
        }
      }
      this.logger.log(
        `completed Syncing lambda functions for account:${data.accountId} region:${data.region}`,
      );
    } catch (error) {
      this.logger.log(
        `Error in syncing lambda functions for account: ${data.accountId} region: ${data.region} ${error}`,
      );
    }
  }
}

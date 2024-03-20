import { Injectable, Logger } from '@nestjs/common';
import { ClientCredentials } from 'src/common/interfaces/awsClient.interface';
import { SQSProps } from 'src/common/interfaces/sqs.interface';
import { ClientConfigurationService } from 'src/libs/aws-sdk/clientConfiguration.service';
import { SQSSdkService } from 'src/libs/aws-sdk/sqsSdk.service';
import { AwsHelperService } from '../helper/helper.service';
import { PRODUCT_CODE } from 'src/common/constants/constants';
import moment from 'moment';
import { SQSRepository } from 'src/infra/repositories/sqs.repository';

@Injectable()
export class SQSService {
  private readonly logger = new Logger(SQSService.name);
  constructor(
    private readonly clientConfigurationService: ClientConfigurationService,
    private readonly sqsSdkService: SQSSdkService,
    private readonly awsHelperService: AwsHelperService,
    private readonly sqsRepository: SQSRepository,
  ) {}
  async syncQueues(data: ClientCredentials) {
    try {
      this.logger.log(
        `started Syncing SQS queues for Account:${data.accountId} Region:${data.region}`,
      );
      const { accountId, accessKeyId, secretAccessKey, currencyCode, region } =
        data;
      const sqsClient =
        await this.clientConfigurationService.getSQSClient(data);
      const queueList = await this.sqsSdkService.listQueues(sqsClient);
      if (queueList.length) {
        for (let i = 0; i < queueList.length; i++) {
          const queueUrl = queueList[i];
          const queueAttributes = await this.sqsSdkService.getQueueAttributes(
            sqsClient,
            queueUrl,
          );
          const { dailyCost, isPrevMonthCostAvailable, prevMonthCost } =
            await this.awsHelperService.getCostDetails({
              resourceId: queueAttributes.QueueArn,
              accountId: accountId,
              productCode: PRODUCT_CODE['Simple Queue Service'],
            });
          const sqsRequest: SQSProps = {
            sqsName: queueAttributes.QueueArn.split(':').pop(),
            sqsTier: queueAttributes.QueueArn.split(':').pop().includes('.fifo')
              ? 'Fifo'
              : 'Standard',
            arn: queueAttributes.QueueArn,
            updatedOn: new Date(Number(queueAttributes.LastModifiedTimestamp)),
            createdOn: new Date(Number(queueAttributes.CreatedTimestamp)),
            accountId: accountId,
            region: region,
            queueUrl: queueUrl,
            monthlyCost: isPrevMonthCostAvailable
              ? prevMonthCost
              : dailyCost * moment().daysInMonth() || 0,
            currencyCode: currencyCode,
            isActive: 1,
          };

          const doesQueueExist = await this.sqsRepository.findByCondition({
            where: {
              accountId,
              arn: queueAttributes.QueueArn,
              isActive: 1,
              region,
            },
          });
          if (doesQueueExist) {
            await this.sqsRepository.update(doesQueueExist.id, {
              ...sqsRequest,
            });
          } else {
            const sqs = this.sqsRepository.create(sqsRequest);
            await this.sqsRepository.save(sqs);
          }
        }
      }
      this.logger.log(
        `completed Syncing SQS queues for Account:${data.accountId} Region:${data.region}`,
      );
    } catch (error) {
      this.logger.log(
        `Error in Syncing SQS Details for Account:${data.accountId} Region:${data.region} Error:${error}`,
      );
    }
  }
}

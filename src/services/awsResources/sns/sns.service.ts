import { Injectable, Logger } from '@nestjs/common';
import { ClientCredentials } from 'src/common/interfaces/awsClient.interface';
import { SNSTopicProps } from 'src/common/interfaces/sns.interface';
import { ClientConfigurationService } from 'src/libs/aws-sdk/clientConfiguration.service';
import { SNSSdkService } from 'src/libs/aws-sdk/snsSdk.service';
import { AwsHelperService } from '../helper/helper.service';
import {
  LOOK_UP_EVENT,
  PRODUCT_CODE,
  RESOURCE_TYPE,
} from 'src/common/constants/constants';
import * as moment from 'moment';
import { CloudTrailSdkService } from 'src/libs/aws-sdk/cloudTrailSdk.service';
import { SNSRepository } from 'src/infra/repositories/sns.repository';

@Injectable()
export class SNSService {
  private readonly logger = new Logger(SNSService.name);
  constructor(
    private readonly clientConfigurationService: ClientConfigurationService,
    private readonly snsSdkService: SNSSdkService,
    private readonly awsHelperService: AwsHelperService,
    private readonly cloudTrailSdkService: CloudTrailSdkService,
    private readonly snsRepository: SNSRepository,
  ) {}
  async syncTopics(data: ClientCredentials) {
    try {
      this.logger.log(
        `started Syncing SNS Topics for account:${data.accountId} region:${data.region}`,
      );
      const { accountId, accessKeyId, secretAccessKey, region, currencyCode } =
        data;
      const snsClient =
        await this.clientConfigurationService.getSNSClient(data);
      const topics = await this.snsSdkService.listTopics(snsClient);
      if (topics.length) {
        const cloudTrailClient =
          await this.clientConfigurationService.getCloudTrailClient(data);
        for (let i = 0; i < topics.length; i++) {
          const topicArn = topics[i].TopicArn;
          const topicAttributes = await this.snsSdkService.getTopicAttributes(
            snsClient,
            topicArn,
          );
          const { dailyCost, isPrevMonthCostAvailable, prevMonthCost } =
            await this.awsHelperService.getCostDetails({
              resourceId: topicArn,
              accountId: accountId,
              productCode: PRODUCT_CODE.SNS,
            });

          const lastModified =
            await this.cloudTrailSdkService.getLatestEventHistory(
              cloudTrailClient,
              {
                LookupAttributes: [
                  {
                    AttributeKey: 'EventSource',
                    AttributeValue: LOOK_UP_EVENT.SNS,
                  },
                ],
              },
              topicArn,
              RESOURCE_TYPE.SNS,
            );
          const snsRequest: SNSTopicProps = {
            snsName: topicArn.split(':').pop(),
            snsTier: topicArn.split(':').pop().includes('.fifo')
              ? 'Fifo'
              : 'Standard',
            arn: topicArn,
            owner: topicAttributes.Owner,
            subscriptionsPending: topicAttributes?.SubscriptionsPending,
            lastModified: new Date(lastModified),
            subscriptionsConfirmed: topicAttributes?.SubscriptionsConfirmed,
            displayName: topicAttributes?.DisplayName,
            subscriptionsDeleted: topicAttributes?.SubscriptionsDeleted,
            region: region,
            accountId: accountId,
            monthlyCost: isPrevMonthCostAvailable
              ? prevMonthCost
              : dailyCost * moment().daysInMonth() || 0,
            currencyCode: currencyCode,
            isActive: 1,
          };
          const doesTopicExist = await this.snsRepository.findByCondition({
            where: { accountId, region, isActive: 1, arn: topicArn },
          });
          if (doesTopicExist) {
            await this.snsRepository.update(doesTopicExist.id, {
              ...snsRequest,
            });
          } else {
            const sns = this.snsRepository.create(snsRequest);
            await this.snsRepository.save(sns);
          }
        }
      }
      this.logger.log(
        `completed Syncing SNS Topics for account:${data.accountId} region:${data.region}`,
      );
    } catch (error) {
      this.logger.log(
        `Error in Syncing SNS Topics for account:${data.accountId} region:${data.region} Error:${error}`,
      );
    }
  }
}

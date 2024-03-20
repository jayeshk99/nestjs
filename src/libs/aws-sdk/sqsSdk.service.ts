import {
  GetQueueAttributesCommand,
  ListQueuesCommand,
  ListQueuesCommandInput,
  ListQueuesCommandOutput,
  SQSClient,
} from '@aws-sdk/client-sqs';
import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class SQSSdkService {
  private readonly logger = new Logger(SQSSdkService.name);
  constructor() {}
  async listQueues(client: SQSClient) {
    const allresources: ListQueuesCommandOutput['QueueUrls'] = [];
    try {
      const input: ListQueuesCommandInput = {};
      let nextToken = null;
      do {
        if (nextToken) {
          input.NextToken = nextToken;
        } else {
          delete input.NextToken;
        }
        const { QueueUrls, NextToken } = await client.send(
          new ListQueuesCommand(input),
        );
        if (QueueUrls.length) {
          allresources.push(...QueueUrls);
        }
        nextToken = NextToken;
      } while (nextToken);
    } catch (error) {
      this.logger.log(`Error occured while listing SQS Error:${error}`);
    }
    return allresources;
  }
  async getQueueAttributes(client: SQSClient, queueUrl: string) {
    try {
      const { Attributes } = await client.send(
        new GetQueueAttributesCommand({
          AttributeNames: ['All'],
          QueueUrl: queueUrl,
        }),
      );
      return Attributes;
    } catch (error) {
      this.logger.log(
        `Error occured while getting queue attributes for SQS:${queueUrl} Error:${error} `,
      );
    }
  }
}

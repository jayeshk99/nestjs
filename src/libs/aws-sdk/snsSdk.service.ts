import {
  GetTopicAttributesCommand,
  ListTopicsCommand,
  ListTopicsCommandInput,
  ListTopicsCommandOutput,
  SNSClient,
} from '@aws-sdk/client-sns';
import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class SNSSdkService {
  private readonly logger = new Logger(SNSSdkService.name);
  constructor() {}
  async listTopics(client: SNSClient) {
    const allresources: ListTopicsCommandOutput['Topics'] = [];
    try {
      const input: ListTopicsCommandInput = {};
      let nextToken = null;
      do {
        if (nextToken) {
          input.NextToken = nextToken;
        } else {
          delete input.NextToken;
        }
        const { Topics, NextToken } = await client.send(
          new ListTopicsCommand(input),
        );
        if (Topics.length) {
          allresources.push(...Topics);
        }
        nextToken = NextToken;
      } while (nextToken);
    } catch (error) {
      this.logger.log(`Error occured while listing SNS Topics Error:${error}`);
    }

    return allresources;
  }
  async getTopicAttributes(client: SNSClient, topicArn: string) {
    try {
      const { Attributes } = await client.send(
        new GetTopicAttributesCommand({ TopicArn: topicArn }),
      );
      return Attributes;
    } catch (error) {
      this.logger.log(
        `Error occured while getting topic attributes for SNS Topics:${topicArn} Error:${error}`,
      );
    }
  }
}

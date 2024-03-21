import {
  LambdaClient,
  ListFunctionsCommand,
  ListFunctionsCommandInput,
  ListFunctionsCommandOutput,
} from '@aws-sdk/client-lambda';
import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class AwsLambdaSdkService {
  private readonly logger = new Logger(AwsLambdaSdkService.name);
  constructor() {}
  async listFunctions(client: LambdaClient) {
    try {
      const allresources: ListFunctionsCommandOutput['Functions'] = [];
      const input: ListFunctionsCommandInput = {};
      let nextToken = null;
      do {
        if (nextToken) {
          input.Marker = nextToken;
        } else {
          delete input.Marker;
        }
        const { Functions, NextMarker } = await client.send(
          new ListFunctionsCommand(input),
        );
        if (Functions.length) {
          allresources.push(...Functions);
        }
        nextToken = NextMarker;
      } while (nextToken);
      return allresources;
    } catch (error) {
      this.logger.log(`Error while listing Aws lambda functions ${error}`);
    }
  }
}

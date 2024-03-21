import { Injectable } from '@nestjs/common';

import {
  DynamoDBClient,
  ListTablesCommand,
  ListTablesCommandInput,
  ListTablesCommandOutput,
  DescribeTableCommand,
} from '@aws-sdk/client-dynamodb';
@Injectable()
export class DynamoDBSdkService {
  async listDynamoDb(dynamoDbClient: DynamoDBClient) {
    const allresources: ListTablesCommandOutput['TableNames'] = [];
    let nextToken: string | null = null;
    const input: ListTablesCommandInput = {};
    do {
      try {
        if (nextToken) {
          input.ExclusiveStartTableName = nextToken;
        } else {
          delete input.ExclusiveStartTableName;
        }

        const data = await dynamoDbClient.send(
          new ListTablesCommand(input),
        );
        const resources = data.TableNames;
        if (resources && resources.length > 0) {
          allresources.push(...resources);
        }

        nextToken = data.LastEvaluatedTableName || null;
      } catch (error) {
        console.error(`Error listing DynamoDB List:`, error);
        break;
      }
    } while (nextToken);
    return allresources;
  }

  async describeTable(dynamoDbClient: DynamoDBClient, tableName: string) {
    const clusterDesc = await dynamoDbClient.send(
      new DescribeTableCommand({ TableName: tableName }),
    );
    return clusterDesc.Table;
  }
}

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
    let efsList: ListTablesCommandOutput['TableNames'] = [];
    let nextToken: string | null = null;
    let inputParams: ListTablesCommandInput = {};
    do {
      try {
        if (nextToken) {
          inputParams.ExclusiveStartTableName = nextToken;
        } else {
          delete inputParams.ExclusiveStartTableName;
        }

        const data = await dynamoDbClient.send(
          new ListTablesCommand(inputParams),
        );
        const resources = data.TableNames;
        if (resources && resources.length > 0) {
          efsList.push(...resources);
        }

        nextToken = data.LastEvaluatedTableName || null;
      } catch (error) {
        console.error(`Error listing DynamoDB List:`, error);
        break;
      }
    } while (nextToken);
    return efsList;
  }

  async describeTable(dynamoDbClient: DynamoDBClient, tableName: string) {
    const clusterDesc = await dynamoDbClient.send(
      new DescribeTableCommand({ TableName: tableName }),
    );
    return clusterDesc.Table;
  }
}

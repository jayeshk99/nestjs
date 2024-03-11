import { Injectable } from '@nestjs/common';
import * as AWS from 'aws-sdk';

import { DescribeVaultOutput, ListVaultsInput } from 'aws-sdk/clients/glacier';
@Injectable()
export class S3GlacierSdkService {
  async listS3Glacier(s3GlacierClient: AWS.Glacier, accountId: string) {
    let glacierList: DescribeVaultOutput[] = [];
    let nextToken: string | null = null;
    // TODO: implement enum for possible values for different resource/ make on global config or enum for aws resources
    let inputParams: ListVaultsInput = { accountId };
    do {
      try {
        if (nextToken) {
          inputParams.marker = nextToken;
        } else {
          delete inputParams.marker;
        }

        const data = await s3GlacierClient.listVaults(inputParams).promise();
        const resources = data.VaultList;
        if (resources && resources.length > 0) {
          glacierList.push(...resources);
        }

        nextToken = data.Marker;
      } catch (error) {
        console.error(`Error listing S3Glacier List:`, error);
        break;
      }
    } while (nextToken);
    return glacierList;
  }
}

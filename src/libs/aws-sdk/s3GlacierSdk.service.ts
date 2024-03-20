import {
  GlacierClient,
  ListVaultsCommand,
  ListVaultsCommandInput,
  ListVaultsCommandOutput,
} from '@aws-sdk/client-glacier';
import { Injectable } from '@nestjs/common';
@Injectable()
export class S3GlacierSdkService {
  async listS3GlacierVaults(
    s3GlacierClient: GlacierClient,
    accountId: string,
  ): Promise<ListVaultsCommandOutput['VaultList']> {
    let glacierList: ListVaultsCommandOutput['VaultList'] = [];
    let nextToken: string | null = null;
    // TODO: implement enum for possible values for different resource/ make on global config or enum for aws resources
    let inputParams: ListVaultsCommandInput = { accountId };
    do {
      try {
        if (nextToken) {
          inputParams.marker = nextToken;
        } else {
          delete inputParams.marker;
        }

        const data = await s3GlacierClient.send(
          new ListVaultsCommand(inputParams),
        );
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

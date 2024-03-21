import { Injectable } from '@nestjs/common';
import {
  GlobalAcceleratorClient,
  ListAcceleratorsCommand,
  ListAcceleratorsCommandInput,
  ListAcceleratorsCommandOutput,
} from '@aws-sdk/client-global-accelerator';
@Injectable()
export class globalAcceleratorSdkService {
  async listAccelerators(globalAcceleratorClient: GlobalAcceleratorClient) {
    let workspaceList: ListAcceleratorsCommandOutput['Accelerators'] = [];
    let nextToken: string | null = null;
    let inputParams: ListAcceleratorsCommandInput = {};
    do {
      try {
        if (nextToken) {
          inputParams.NextToken = nextToken;
        } else {
          delete inputParams.NextToken;
        }

        const data = await globalAcceleratorClient.send(
          new ListAcceleratorsCommand(inputParams),
        );
        const resources = data.Accelerators;
        if (resources && resources.length > 0) {
          workspaceList.push(...resources);
        }

        nextToken = data.NextToken || null;
      } catch (error) {
        console.error(`Error listing Global Accelerator List:`, error);
        break;
      }
    } while (nextToken);
    return workspaceList;
  }
}

import { Injectable } from '@nestjs/common';
import {
  AwsClientRequest,
  ListResourcesProps,
} from 'src/common/interfaces/awsClient.interface';
import * as AWS from 'aws-sdk';
import { LIST_RESOURCE_KEY } from 'src/common/constants/constants';
import { FileSystemDescription } from 'aws-sdk/clients/efs';
@Injectable()
export class EFSSdkService {
  async listEfs(efsClient: AWS.EFS) {
    let efsList: FileSystemDescription[] = [];
    let nextToken: string | null = null;
    // TODO: implement enum for possible values for different resource/ make on global config or enum for aws resources
    let inputParams: ListResourcesProps = {};
    do {
      try {
        if (nextToken) {
          inputParams.Marker = nextToken;
        } else {
          delete inputParams.Marker;
        }

        const data = await efsClient.describeFileSystems(inputParams).promise();
        const resources = data.FileSystems;

        if (resources && resources.length > 0) {
          efsList.push(...resources);
        }

        nextToken = data.NextMarker;
      } catch (error) {
        console.error(`Error listing EFS List:`, error);
        break;
      }
    } while (nextToken);
    return efsList;
  }
}

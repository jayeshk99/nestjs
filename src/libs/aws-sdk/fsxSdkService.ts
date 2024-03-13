import { Injectable } from '@nestjs/common';
import * as AWS from 'aws-sdk';

import { DescribeFileSystemsResponse } from 'aws-sdk/clients/fsx';
import { ListResourcesProps } from 'src/common/interfaces/awsClient.interface';
import {
  DescribeFileSystemsCommand,
  DescribeFileSystemsCommandOutput,
  FSxClient,
} from '@aws-sdk/client-fsx';
@Injectable()
export class FsxSdkService {
  async listFileSystems(
    fsxClient: FSxClient,
  ): Promise<DescribeFileSystemsCommandOutput['FileSystems']> {
    const allResources: DescribeFileSystemsCommandOutput['FileSystems'] = [];
    const fsxListParams: ListResourcesProps = {
      MaxResults: 50,
      NextToken: null,
    };
    let nextToken: string | null = null;
    do {
      try {
        if (nextToken) {
          fsxListParams.NextToken = nextToken;
        } else {
          delete fsxListParams.NextToken;
        }

        const data = await fsxClient.send(
          new DescribeFileSystemsCommand(fsxListParams),
        );
        const resources = data.FileSystems;

        if (resources && resources.length > 0) {
          allResources.push(...resources);
        }

        nextToken = data.NextToken;
      } catch (error) {
        console.error(`Error listing Fsx File systems:`, error);
        break;
      }
    } while (nextToken);

    return allResources;
  }
}

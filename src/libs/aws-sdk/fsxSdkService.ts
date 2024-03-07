import { Injectable } from '@nestjs/common';
import * as AWS from 'aws-sdk';

import { DescribeFileSystemsResponse } from 'aws-sdk/clients/fsx';
@Injectable()
export class FsxSdkService {
  async describeFileSystems(
    fsxClient: AWS.FSx,
  ): Promise<DescribeFileSystemsResponse['FileSystems']> {
    const allResources: DescribeFileSystemsResponse['FileSystems'] = [];
    const fsxListParams = { MaxResults: 50, NextToken: null };
    let NextToken = null;
    do {
      try {
        if (NextToken) {
          fsxListParams.NextToken = NextToken;
        } else {
          delete fsxListParams['NextToken'];
        }

        const data = await fsxClient
          .describeFileSystems(fsxListParams)
          .promise();
        const resources = data.FileSystems;

        if (resources && resources.length > 0) {
          allResources.push(...resources);
        }

        NextToken = data.NextToken;
      } catch (error) {
        console.error(`Error listing Fsx instances:`, error);
        break;
      }
    } while (NextToken);
    return allResources;
  }
}

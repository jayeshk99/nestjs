import { Injectable } from '@nestjs/common';
import { DBInstanceMessage } from 'aws-sdk/clients/rds';

import { ListResourcesProps } from 'src/common/interfaces/awsClient.interface';
@Injectable()
export class RdsSdkService {
  async listInstances(
    rdsClient: AWS.RDS,
  ): Promise<DBInstanceMessage['DBInstances']> {
    const allResources: DBInstanceMessage['DBInstances'] = [];
    const fsxListParams: ListResourcesProps = { MaxRecords: 50, Marker: null };
    let nextToken = null;
    do {
      try {
        if (nextToken) {
          fsxListParams.Marker = nextToken;
        } else {
          delete fsxListParams.Marker;
        }
        const data = await rdsClient
          .describeDBInstances(fsxListParams)
          .promise();
        const resources = data.DBInstances;

        if (resources && resources.length > 0) {
          allResources.push(...resources);
        }

        nextToken = data.Marker;
      } catch (error) {
        console.log(error);
      }
    } while (nextToken);
    return allResources;
  }
}

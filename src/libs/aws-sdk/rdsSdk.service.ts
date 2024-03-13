import { Injectable } from '@nestjs/common';
import { DBInstanceMessage } from 'aws-sdk/clients/rds';

import { ListResourcesProps } from 'src/common/interfaces/awsClient.interface';
import {
  DescribeDBInstancesCommand,
  DescribeDBInstancesCommandOutput,
  RDSClient,
} from '@aws-sdk/client-rds';
@Injectable()
export class RdsSdkService {
  async listRdsInstances(
    rdsClient: RDSClient,
  ): Promise<DescribeDBInstancesCommandOutput['DBInstances']> {
    const allResources: DescribeDBInstancesCommandOutput['DBInstances'] = [];
    const rdsListParams: ListResourcesProps = { MaxRecords: 50, Marker: null };
    let nextToken = null;
    do {
      try {
        if (nextToken) {
          rdsListParams.Marker = nextToken;
        } else {
          delete rdsListParams.Marker;
        }
        const data = await rdsClient.send(
          new DescribeDBInstancesCommand(rdsListParams),
        );

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

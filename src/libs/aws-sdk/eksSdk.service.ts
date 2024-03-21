import { Injectable } from '@nestjs/common';
import { ListResourcesProps } from 'src/common/interfaces/awsClient.interface';
import * as AWS from 'aws-sdk';
import { Cluster, DescribeClusterRequest } from 'aws-sdk/clients/eks';
import {
  DescribeClusterCommand,
  DescribeClusterCommandOutput,
  EKSClient,
  ListClustersCommand,
  ListClustersCommandInput,
  ListClustersCommandOutput,
} from '@aws-sdk/client-eks';
@Injectable()
export class EKSSdkService {
  async listEks(
    eksClient: EKSClient,
  ): Promise<ListClustersCommandOutput['clusters']> {
    const allresources: ListClustersCommandOutput['clusters'] = [];
    let nextToken: string | null = null;
    // TODO: implement enum for possible values for different resource/ make on global config or enum for aws resources
    const inputParams: ListClustersCommandInput = {};
    do {
      try {
        if (nextToken) {
          inputParams.nextToken = nextToken;
        } else {
          delete inputParams.nextToken;
        }

        const data = await eksClient.send(new ListClustersCommand(inputParams));
        const resources = data.clusters;

        if (resources && resources.length > 0) {
          allresources.push(...resources);
        }

        nextToken = data.nextToken;
      } catch (error) {
        console.error(`Error listing Eks List:`, error);
        break;
      }
    } while (nextToken);
    return allresources;
  }

  async describeCluster(
    eksClient: EKSClient,
    data: DescribeClusterRequest,
  ): Promise<DescribeClusterCommandOutput['cluster']> {
    const cluster = await eksClient.send(new DescribeClusterCommand(data));
    return cluster.cluster;
  }
}

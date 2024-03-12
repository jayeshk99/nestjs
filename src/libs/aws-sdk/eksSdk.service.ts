import { Injectable } from '@nestjs/common';
import { ListResourcesProps } from 'src/common/interfaces/awsClient.interface';
import * as AWS from 'aws-sdk';
import { Cluster, DescribeClusterRequest } from 'aws-sdk/clients/eks';
@Injectable()
export class EKSSdkService {
  async listEks(eksClient: AWS.EKS) {
    let eksList: string[] = [];
    let nextToken: string | null = null;
    // TODO: implement enum for possible values for different resource/ make on global config or enum for aws resources
    let inputParams: ListResourcesProps = {};
    do {
      try {
        if (nextToken) {
          inputParams.nextToken = nextToken;
        } else {
          delete inputParams.nextToken;
        }

        const data = await eksClient.listClusters(inputParams).promise();
        const resources = data.clusters;

        if (resources && resources.length > 0) {
          eksList.push(...resources);
        }

        nextToken = data.nextToken;
      } catch (error) {
        console.error(`Error listing Eks List:`, error);
        break;
      }
    } while (nextToken);
    return eksList;
  }

  async describeCluster(eksClient: AWS.EKS, data: DescribeClusterRequest) {
    const cluster = await eksClient.describeCluster(data).promise();

    return cluster.cluster;
  }
}

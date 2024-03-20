import { Injectable } from '@nestjs/common';
import {
  EMRClient,
  ListClustersCommand,
  ListClustersCommandInput,
  ListClustersCommandOutput,
  DescribeClusterCommand,
} from '@aws-sdk/client-emr';
@Injectable()
export class EMRSdkService {
  async listEmr(efsClient: EMRClient) {
    let efsList: ListClustersCommandOutput['Clusters'] = [];
    let nextToken: string | null = null;
    let inputParams: ListClustersCommandInput = {};
    do {
      try {
        if (nextToken) {
          inputParams.Marker = nextToken;
        } else {
          delete inputParams.Marker;
        }

        const data = await efsClient.send(new ListClustersCommand(inputParams));
        const resources = data.Clusters;
        if (resources && resources.length > 0) {
          efsList.push(...resources);
        }

        nextToken = data.Marker || null;
      } catch (error) {
        console.error(`Error listing EMR List:`, error);
        break;
      }
    } while (nextToken);
    return efsList;
  }

  async describeEmrCluster(emrClient: EMRClient, clusterId: string) {
    const clusterDesc = await emrClient.send(
      new DescribeClusterCommand({ ClusterId: clusterId }),
    );
    return clusterDesc.Cluster;
  }
}

import { Injectable, Logger } from '@nestjs/common';
import {
  EMRClient,
  ListClustersCommand,
  ListClustersCommandInput,
  ListClustersCommandOutput,
  DescribeClusterCommand,
} from '@aws-sdk/client-emr';
@Injectable()
export class EMRSdkService {
  private readonly logger = new Logger(EMRSdkService.name);
  async listEMRClusters(client: EMRClient) {
    let efsList: ListClustersCommandOutput['Clusters'] = [];
    try {
      let nextToken: string | null = null;
      let input: ListClustersCommandInput = {};
      do {
        if (nextToken) {
          input.Marker = nextToken;
        } else {
          delete input.Marker;
        }
        const { Clusters, Marker } = await client.send(
          new ListClustersCommand(input),
        );

        if (Clusters.length > 0) {
          efsList.push(...Clusters);
        }

        nextToken = Marker || null;
      } while (nextToken);
    } catch (error) {
      this.logger.log(`Error in listing EMR clusters Error:${error}`);
    }
    return efsList;
  }

  async describeEMRCluster(emrClient: EMRClient, clusterId: string) {
    try {
      const { Cluster } = await emrClient.send(
        new DescribeClusterCommand({ ClusterId: clusterId }),
      );
      return Cluster;
    } catch (error) {
      this.logger.log(
        `Error in fetching cluster details cluster:${clusterId} Error:${error}`,
      );
    }
  }
}

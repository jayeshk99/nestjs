import { Injectable } from '@nestjs/common';
import { ListResourcesProps } from 'src/common/interfaces/awsClient.interface';
import {
  DescribeContainerInstancesCommand,
  DescribeContainerInstancesCommandInput,
  DescribeContainerInstancesCommandOutput,
  ECSClient,
  ListClustersCommand,
  ListClustersCommandOutput,
  ListContainerInstancesCommand,
  ListContainerInstancesCommandInput,
  ListContainerInstancesCommandOutput,
} from '@aws-sdk/client-ecs';
@Injectable()
export class ECSSdkService {
  async listEcsClusters(
    ecsClient: ECSClient,
  ): Promise<ListClustersCommandOutput['clusterArns']> {
    let ecsList: ListClustersCommandOutput['clusterArns'] = [];
    let nextToken: string | null = null;
    let inputParams: ListResourcesProps = {};
    do {
      try {
        if (nextToken) {
          inputParams.nextToken = nextToken;
        } else {
          delete inputParams.nextToken;
        }

        const data = await ecsClient.send(new ListClustersCommand(inputParams));
        const resources = data.clusterArns;
        if (resources && resources.length > 0) {
          ecsList.push(...resources);
        }

        nextToken = data.nextToken || null;
      } catch (error) {
        console.error(`Error listing ECS clusters List:`, error);
        break;
      }
    } while (nextToken);
    return ecsList;
  }

  async listEcsInstances(
    ecsClient: ECSClient,
    clusterName: string,
  ): Promise<ListContainerInstancesCommandOutput['containerInstanceArns']> {
    let ecsList: ListContainerInstancesCommandOutput['containerInstanceArns'] =
      [];
    let nextToken: string | null = null;
    let inputParams: ListContainerInstancesCommandInput = {
      cluster: clusterName,
    };

    do {
      try {
        if (nextToken) {
          inputParams.nextToken = nextToken;
        } else {
          delete inputParams.nextToken;
        }

        const data = await ecsClient.send(
          new ListContainerInstancesCommand(inputParams),
        );
        const resources = data.containerInstanceArns;
        if (resources && resources.length > 0) {
          ecsList.push(...resources);
        }
        nextToken = data.nextToken || null;
      } catch (error) {
        console.error(`Error listing ECS instances List:`, error);
        break;
      }
    } while (nextToken);
    return ecsList;
  }

  async describeEcsInstance(
    ecsClient: ECSClient,
    clusterName: string,
    containerInstances: string[],
  ) {
    let instanceDesc: DescribeContainerInstancesCommandOutput['containerInstances'] =
      [];
    let instances: string[] = [];
    instances = [...containerInstances.slice(0, 100)];
    let index = 100;
    while (instances.length) {
      try {
        let inputParams: DescribeContainerInstancesCommandInput = {
          cluster: clusterName,
          containerInstances: instances,
        };
        const data = await ecsClient.send(
          new DescribeContainerInstancesCommand(inputParams),
        );
        const resources = data.containerInstances;
        if (resources && resources.length > 0) {
          instanceDesc.push(...resources);
        }
        instances = [...containerInstances.slice(index + 1, index + 100)];
        index += 100;
      } catch (error) {
        console.error(`Error DESCRIBING ECS INSTANCE :`, error);
        break;
      }
    }
    return instanceDesc;
  }
}

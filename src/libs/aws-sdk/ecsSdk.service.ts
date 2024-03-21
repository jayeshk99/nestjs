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
  async listEcsClusters(ecsClient: ECSClient) {
    const allresources: ListClustersCommandOutput['clusterArns'] = [];
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
          allresources.push(...resources);
        }

        nextToken = data.nextToken || null;
      } catch (error) {
        console.error(`Error listing ECS clusters List:`, error);
        break;
      }
    } while (nextToken);
    return allresources;
  }

  async listEcsInstances(ecsClient: ECSClient, clusterArn: string) {
    const allresources: ListContainerInstancesCommandOutput['containerInstanceArns'] =
      [];
    let nextToken: string | null = null;
    const inputParams: ListContainerInstancesCommandInput = {
      cluster: clusterArn,
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
          allresources.push(...resources);
        }
        nextToken = data.nextToken || null;
      } catch (error) {
        console.error(`Error listing ECS instances List:`, error);
        break;
      }
    } while (nextToken);
    return allresources;
  }

  async describeEcsInstance(
    ecsClient: ECSClient,
    clusterName: string,
    containerInstancesArray: string[],
  ) {
    const instanceDesc: DescribeContainerInstancesCommandOutput['containerInstances'] =
      [];
    let instances: string[] = [];
    instances = [...containerInstancesArray.slice(0, 100)];
    let index = 100;
    while (instances.length) {
      try {
        let inputParams: DescribeContainerInstancesCommandInput = {
          cluster: clusterName,
          containerInstances: instances,
        };
        const { containerInstances } = await ecsClient.send(
          new DescribeContainerInstancesCommand(inputParams),
        );

        if (containerInstances && containerInstances.length > 0) {
          instanceDesc.push(...containerInstances);
        }
        instances = [...containerInstancesArray.slice(index + 1, index + 100)];
        index += 100;
      } catch (error) {
        console.error(`Error DESCRIBING ECS INSTANCE :`, error);
        break;
      }
    }
    return instanceDesc;
  }
}

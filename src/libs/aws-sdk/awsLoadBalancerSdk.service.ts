import { Injectable } from '@nestjs/common';
import { ListResourcesProps } from 'src/common/interfaces/awsClient.interface';
import {
  DescribeLoadBalancersCommand,
  ElasticLoadBalancingClient,
  DescribeLoadBalancersCommandOutput,
} from '@aws-sdk/client-elastic-load-balancing';
import {
  ElasticLoadBalancingV2Client,
  DescribeLoadBalancersCommandOutput as DescribeLoadBalancersV2CommandOutput,
  DescribeLoadBalancersCommand as DescribeLoadBalancersV2Command,
  DescribeTargetGroupsCommand,
  DescribeTargetGroupsCommandOutput,
} from '@aws-sdk/client-elastic-load-balancing-v2';
import { DescribeTargetGroupsInput } from 'aws-sdk/clients/elbv2';

@Injectable()
export class AWSLoadBalancerSdkService {
  async listAwsLoadBalancer(
    awsLoadBalancerClient: ElasticLoadBalancingClient,
  ): Promise<DescribeLoadBalancersCommandOutput['LoadBalancerDescriptions']> {
    let elbList: DescribeLoadBalancersCommandOutput['LoadBalancerDescriptions'] =
      [];
    let nextToken: string | null = null;
    let inputParams: ListResourcesProps = {};
    do {
      try {
        if (nextToken) {
          inputParams.Marker = nextToken;
        } else {
          delete inputParams.Marker;
        }

        const data = await awsLoadBalancerClient.send(
          new DescribeLoadBalancersCommand(inputParams),
        );
        const resources = data.LoadBalancerDescriptions;

        if (resources && resources.length > 0) {
          elbList.push(...resources);
        }

        nextToken = data.NextMarker;
      } catch (error) {
        console.error(`Error listing AWSLoad Balancer List:`, error);
        break;
      }
    } while (nextToken);
    return elbList;
  }

  // ******
  //  Load balancer version 2 commands
  //  ******
  async listAwsLoadBalancerV2(
    awsLoadBalancerClient: ElasticLoadBalancingV2Client,
  ): Promise<DescribeLoadBalancersV2CommandOutput['LoadBalancers']> {
    let elbList: DescribeLoadBalancersV2CommandOutput['LoadBalancers'] = [];
    let nextToken: string | null = null;
    let inputParams: ListResourcesProps = {};
    do {
      try {
        if (nextToken) {
          inputParams.Marker = nextToken;
        } else {
          delete inputParams.Marker;
        }

        const data = await awsLoadBalancerClient.send(
          new DescribeLoadBalancersV2Command(inputParams),
        );
        const resources = data.LoadBalancers;

        if (resources && resources.length > 0) {
          elbList.push(...resources);
        }

        nextToken = data.NextMarker;
      } catch (error) {
        console.error(`Error listing AWSLoad Balancer List:`, error);
        break;
      }
    } while (nextToken);
    return elbList;
  }
  async describeTargetGroup(
    awsLoadBalancerV2Client: ElasticLoadBalancingV2Client,
    loadBalancerArn: string,
  ): Promise<DescribeTargetGroupsCommandOutput['TargetGroups']> {
    let targetGroupsList: DescribeTargetGroupsCommandOutput['TargetGroups'] =
      [];
    let nextToken: string | null = null;
    let inputParams: DescribeTargetGroupsInput = {
      LoadBalancerArn: loadBalancerArn,
    };
    do {
      try {
        if (nextToken) {
          inputParams.Marker = nextToken;
        } else {
          delete inputParams.Marker;
        }

        const data = await awsLoadBalancerV2Client.send(
          new DescribeTargetGroupsCommand(inputParams),
        );

        const resources = data.TargetGroups;

        if (resources && resources.length > 0) {
          targetGroupsList.push(...resources);
        }

        nextToken = data.NextMarker;
      } catch (error) {
        console.error(`Error listing AWSLoad Balancer List:`, error);
        break;
      }
    } while (nextToken);
    return targetGroupsList;
  }
}

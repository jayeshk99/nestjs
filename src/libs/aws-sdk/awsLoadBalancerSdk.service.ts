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
  async listAwsLoadBalancer(awsLoadBalancerClient: ElasticLoadBalancingClient) {
    const allresources: DescribeLoadBalancersCommandOutput['LoadBalancerDescriptions'] =
      [];
    let nextToken: string | null = null;
    const input: ListResourcesProps = {};
    do {
      try {
        if (nextToken) {
          input.Marker = nextToken;
        } else {
          delete input.Marker;
        }

        const data = await awsLoadBalancerClient.send(
          new DescribeLoadBalancersCommand(input),
        );
        const resources = data.LoadBalancerDescriptions;

        if (resources && resources.length > 0) {
          allresources.push(...resources);
        }

        nextToken = data.NextMarker;
      } catch (error) {
        console.error(`Error listing AWSLoad Balancer List:`, error);
        break;
      }
    } while (nextToken);
    return allresources;
  }

  // ******
  //  Load balancer version 2 commands
  //  ******
  async listAwsLoadBalancerV2(
    awsLoadBalancerClient: ElasticLoadBalancingV2Client,
  ) {
    const allresources: DescribeLoadBalancersV2CommandOutput['LoadBalancers'] = [];
    let nextToken: string | null = null;
    const input: ListResourcesProps = {};
    do {
      try {
        if (nextToken) {
          input.Marker = nextToken;
        } else {
          delete input.Marker;
        }

        const data = await awsLoadBalancerClient.send(
          new DescribeLoadBalancersV2Command(input),
        );
        const resources = data.LoadBalancers;

        if (resources && resources.length > 0) {
          allresources.push(...resources);
        }

        nextToken = data.NextMarker;
      } catch (error) {
        console.error(`Error listing AWSLoad Balancer List:`, error);
        break;
      }
    } while (nextToken);
    return allresources;
  }
  async describeTargetGroup(
    awsLoadBalancerV2Client: ElasticLoadBalancingV2Client,
    loadBalancerArn: string,
  ) {
    const targetGroupsList: DescribeTargetGroupsCommandOutput['TargetGroups'] =
      [];
    let nextToken: string | null = null;
    const inputParams: DescribeTargetGroupsInput = {
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

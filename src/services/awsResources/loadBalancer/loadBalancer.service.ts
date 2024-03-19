import { Injectable, Logger } from '@nestjs/common';
import {
  LOAD_BALANCER_TYPE,
  LOAD_BALANCER_VERSION,
  PRODUCT_CODE,
} from 'src/common/constants/constants';
import { ClientCredentials } from 'src/common/interfaces/awsClient.interface';
import { ClientConfigurationService } from 'src/libs/aws-sdk/clientConfiguration.service';
import { AwsHelperService } from '../helper/helper.service';
import { AwsUsageDetailsRepository } from 'src/infra/repositories/awsUsageDetails.repository';
import { AWSLoadBalancerRepository } from 'src/infra/repositories/loadBalancer.repository';
import { AWSLoadBalancerSdkService } from 'src/libs/aws-sdk/awsLoadBalancerSdk.service';
import {
  DescribeLoadBalancersCommandOutput as DescribeLoadBalancersV2CommandOutput,
  DescribeTargetGroupsCommandOutput,
  ElasticLoadBalancingV2Client,
} from '@aws-sdk/client-elastic-load-balancing-v2';
import {
  DescribeLoadBalancersCommandOutput,
  ElasticLoadBalancingClient,
} from '@aws-sdk/client-elastic-load-balancing';
import { AWSLoadBalancerProps } from 'src/common/interfaces/loadBalancer.interface';
import * as moment from 'moment';

@Injectable()
export class AWSLoadBalancerService {
  private readonly logger = new Logger(AWSLoadBalancerService.name);
  constructor(
    private readonly clientConfigurationService: ClientConfigurationService,
    private readonly awsHelperService: AwsHelperService,
    private readonly awsUsageDetailsRepository: AwsUsageDetailsRepository,
    private readonly awsLoadBalancerRepository: AWSLoadBalancerRepository,
    private readonly awsLoadBalancerSdkService: AWSLoadBalancerSdkService,
  ) {}
  async fetchAWSLoadBalancerDetails(data: ClientCredentials) {
    try {
      this.logger.log(
        `AWSLoad Balancer details job STARTED for account: ${data.accountId} region: ${data.region}`,
      );
      const { accessKeyId, secretAccessKey, accountId, region,currencyCode } = data;
      const currentTimestamp = new Date();
      const loadBalancerClient =
        await this.clientConfigurationService.getAWSLoadBalancerClient(data);
      const loadBalancerV2Client =
        await this.clientConfigurationService.getAWSLoadBalancerV2Client(data);
      const [loadBalancerList, loadBalancerV2List] = await Promise.all([
        this.awsLoadBalancerSdkService.listAwsLoadBalancer(loadBalancerClient),
        this.awsLoadBalancerSdkService.listAwsLoadBalancerV2(
          loadBalancerV2Client,
        ),
      ]);
      const [v1Fields, v2Fields] = await Promise.all([
        this.getLoadBalancerV1Fields(
          loadBalancerClient,
          loadBalancerList,
          currencyCode,
          data,
        ),
        this.getLoadBalancerV2Fields(
          loadBalancerV2Client,
          loadBalancerV2List,
          currencyCode,
          data,
        ),
      ]);
      const loadBalancersData = [...v1Fields, ...v2Fields];
      for (let elb of loadBalancersData) {
        const isBucketExist =
          await this.awsLoadBalancerRepository.findLoadBalancer(elb);
        if (isBucketExist) {
          await this.awsLoadBalancerRepository.updateLoadBalancer(
            isBucketExist.id,
            elb,
          );
        } else {
          await this.awsLoadBalancerRepository.createLoadBalancer(elb);
        }
      }

      this.logger.log(
        `AWSLoad Balancer Details job COMPLETED for account: ${data.accountId} region: ${data.region}`,
      );
    } catch (error) {
      this.logger.log(
        `Error in getting AWSLoad Balancer Details for account: ${data.accountId} region: ${data.region}: Error: ${error}`,
      );
    }
  }

  async getLoadBalancerV1Fields(
    v1Client: ElasticLoadBalancingClient,
    elbList: DescribeLoadBalancersCommandOutput['LoadBalancerDescriptions'],
    currencyCode: string,
    data: ClientCredentials,
  ): Promise<AWSLoadBalancerProps[]> {
    try {
      let formattedElbList: AWSLoadBalancerProps[] = [];
      for (let elb of elbList) {
        const { accessKeyId, secretAccessKey, accountId, region } = data;
        const loadBalancerArn = `arn:aws:elasticloadbalancing:${region}:${accountId}:loadbalancer/${elb.LoadBalancerName}`;
        const { dailyCost, isPrevMonthCostAvailable, prevMonthCost } =
          await this.awsHelperService.getCostDetails({
            resourceId: loadBalancerArn,
            accountId: accountId,
            productCode: PRODUCT_CODE['AWS Load Balancers'],
          });
        const loadBalancerFields: AWSLoadBalancerProps = {
          loadBalancerArn: loadBalancerArn,
          loadBalancerName: elb.LoadBalancerName,
          region: region,
          createdOn: elb.CreatedTime,
          scheme: elb.Scheme,
          vpcId: elb.VPCId,
          loadBalancerType: LOAD_BALANCER_TYPE.CLASSIC,
          ipAddressType: null,
          instances:
            (elb.Instances?.length &&
              elb.Instances.map(({ InstanceId }) => InstanceId).join(', ')) ||
            null,
          state: null,
          securityGroups: elb.SecurityGroups?.join(','),
          accountId: accountId,
          monthlyCost: isPrevMonthCostAvailable
            ? prevMonthCost
            : dailyCost
              ? dailyCost * moment().daysInMonth()
              : 0,
          currencyCode: currencyCode,
          loadBalancerVersion: LOAD_BALANCER_VERSION.V1,
          targetGroupNames: null,
        };
        formattedElbList.push(loadBalancerFields);
      }
      return formattedElbList;
    } catch (error) {
      this.logger.log(
        `Error in getting AWSLoad Balancer V1 Details for account: ${data.accountId} region: ${data.region}: Error: ${error}`,
      );
    }
  }

  async getLoadBalancerV2Fields(
    v2Client: ElasticLoadBalancingV2Client,
    elbList: DescribeLoadBalancersV2CommandOutput['LoadBalancers'],
    currencyCode: string,
    data: ClientCredentials,
  ): Promise<AWSLoadBalancerProps[]> {
    try {
      let formattedElbList: AWSLoadBalancerProps[] = [];
      for (let elb of elbList) {
        const { accessKeyId, secretAccessKey, accountId, region } = data;
        const { dailyCost, isPrevMonthCostAvailable, prevMonthCost } =
          await this.awsHelperService.getCostDetails({
            resourceId: elb.LoadBalancerArn,
            accountId: accountId,
            productCode: PRODUCT_CODE['AWS Load Balancers'],
          });
        const targetGroups =
          await this.awsLoadBalancerSdkService.describeTargetGroup(
            v2Client,
            elb.LoadBalancerArn,
          );
        let targetGroupNames =
          targetGroups && targetGroups.map((group) => group.TargetGroupName);
        const loadBalancerFields: AWSLoadBalancerProps = {
          loadBalancerArn: elb.LoadBalancerArn,
          loadBalancerName: elb.LoadBalancerName,
          region: region,
          createdOn: elb.CreatedTime,
          scheme: elb.Scheme,
          vpcId: elb.VpcId,
          loadBalancerType: elb.Type,
          ipAddressType: elb.IpAddressType,
          instances: null,
          state: elb.State.Code,
          securityGroups: elb.SecurityGroups?.join(','),
          accountId: accountId,
          monthlyCost: isPrevMonthCostAvailable
            ? prevMonthCost
            : dailyCost
              ? dailyCost * moment().daysInMonth()
              : 0,
          currencyCode: currencyCode,
          loadBalancerVersion: LOAD_BALANCER_VERSION.V2,
          targetGroupNames: targetGroupNames.join(','),
        };
        formattedElbList.push(loadBalancerFields);
      }
      return formattedElbList;
    } catch (error) {
      this.logger.log(
        `Error in getting AWSLoad Balancer V2 Details for account: ${data.accountId} region: ${data.region}: Error: ${error}`,
      );
    }
  }
}

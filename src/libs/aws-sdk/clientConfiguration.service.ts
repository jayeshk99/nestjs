import { Injectable } from '@nestjs/common';
import { ClientCredentials } from '../../common/interfaces/awsClient.interface';
import { EC2Client } from '@aws-sdk/client-ec2';
import { CloudWatchClient } from '@aws-sdk/client-cloudwatch';
import { S3Client } from '@aws-sdk/client-s3';
import { EFSClient } from '@aws-sdk/client-efs';
import { FSxClient } from '@aws-sdk/client-fsx';
import { RDSClient } from '@aws-sdk/client-rds';
import { PricingClient } from '@aws-sdk/client-pricing';
import { GlacierClient } from '@aws-sdk/client-glacier';
import { ECRClient } from '@aws-sdk/client-ecr';
import { EKSClient } from '@aws-sdk/client-eks';
import { ElasticLoadBalancingClient } from '@aws-sdk/client-elastic-load-balancing';
import { ElasticLoadBalancingV2Client } from '@aws-sdk/client-elastic-load-balancing-v2';
import { ECSClient } from '@aws-sdk/client-ecs';
import { ResourceGroupsClient } from '@aws-sdk/client-resource-groups';
import { CloudTrailClient } from '@aws-sdk/client-cloudtrail';
import { EMRClient } from '@aws-sdk/client-emr';

@Injectable()
export class ClientConfigurationService {
  async getEC2Client(creds: ClientCredentials): Promise<EC2Client> {
    const { accessKeyId, secretAccessKey, region } = creds;
    return new EC2Client({
      credentials: { accessKeyId, secretAccessKey },
      region,
    });
  }

  async getPricingClient(creds: ClientCredentials): Promise<PricingClient> {
    const { accessKeyId, secretAccessKey, region } = creds;
    return new PricingClient({
      credentials: { accessKeyId, secretAccessKey },
      region,
    });
  }

  async getCloudWatchClient(
    creds: ClientCredentials,
  ): Promise<CloudWatchClient> {
    const { accessKeyId, secretAccessKey, region } = creds;
    return new CloudWatchClient({
      credentials: { accessKeyId, secretAccessKey },
      region,
    });
  }

  async getS3Client(creds: ClientCredentials): Promise<S3Client> {
    const { accessKeyId, secretAccessKey, region } = creds;
    return new S3Client({
      credentials: { accessKeyId, secretAccessKey },
      region,
    });
  }

  async getEFSClient(creds: ClientCredentials): Promise<EFSClient> {
    const { region, accessKeyId, secretAccessKey } = creds;
    return new EFSClient({
      region: region,
      credentials: { accessKeyId, secretAccessKey },
    });
  }

  async getS3GlacierClient(creds: ClientCredentials): Promise<GlacierClient> {
    const { region, accessKeyId, secretAccessKey } = creds;
    return new GlacierClient({
      region: region,
      credentials: { accessKeyId, secretAccessKey },
    });
  }
  async getFsxClient(creds: ClientCredentials): Promise<FSxClient> {
    const { region, accessKeyId, secretAccessKey } = creds;
    return new FSxClient({
      region,
      credentials: { accessKeyId, secretAccessKey },
    });
  }
  async getEcrClient(creds: ClientCredentials): Promise<ECRClient> {
    const { region, accessKeyId, secretAccessKey } = creds;
    return new ECRClient({
      region,
      credentials: { accessKeyId, secretAccessKey },
    });
  }
  async getEksClient(creds: ClientCredentials): Promise<EKSClient> {
    const { region, accessKeyId, secretAccessKey } = creds;
    return new EKSClient({
      region,
      credentials: { accessKeyId, secretAccessKey },
    });
  }
  async getRdsClient(creds: ClientCredentials): Promise<RDSClient> {
    const { region, accessKeyId, secretAccessKey } = creds;
    return new RDSClient({
      region,
      credentials: { accessKeyId, secretAccessKey },
    });
  }
  async getResourceGroupClient(
    creds: ClientCredentials,
  ): Promise<ResourceGroupsClient> {
    const { region, accessKeyId, secretAccessKey } = creds;
    return new ResourceGroupsClient({
      region,
      credentials: { accessKeyId, secretAccessKey },
    });
  }
  async getCloudTrailClient(
    creds: ClientCredentials,
  ): Promise<CloudTrailClient> {
    const { region, accessKeyId, secretAccessKey } = creds;
    return new CloudTrailClient({
      region,
      credentials: { accessKeyId, secretAccessKey },
    });
  }

  async getAWSLoadBalancerClient(creds: ClientCredentials) {
    const { region, accessKeyId, secretAccessKey } = creds;
    const loadBalancerClient = new ElasticLoadBalancingClient({
      region,
      credentials: { accessKeyId, secretAccessKey },
    });
    return loadBalancerClient;
  }
  async getAWSLoadBalancerV2Client(creds: ClientCredentials) {
    const { region, accessKeyId, secretAccessKey } = creds;
    const loadBalancerClient = new ElasticLoadBalancingV2Client({
      region,
      credentials: { accessKeyId, secretAccessKey },
    });
    return loadBalancerClient;
  }
  async getEcsClient(creds: ClientCredentials) {
    const { region, accessKeyId, secretAccessKey } = creds;
    const loadBalancerClient = new ECSClient({
      region,
      credentials: { accessKeyId, secretAccessKey },
    });
    return loadBalancerClient;
  }

  async getEmrClient(creds: ClientCredentials) {
    const { region, accessKeyId, secretAccessKey } = creds;
    const emrClient = new EMRClient({
      region,
      credentials: { accessKeyId, secretAccessKey },
    });
    return emrClient;
  }
}

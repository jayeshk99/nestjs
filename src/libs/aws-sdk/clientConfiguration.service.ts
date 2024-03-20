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
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { ElasticBeanstalkClient } from '@aws-sdk/client-elastic-beanstalk';
import { SNSClient } from '@aws-sdk/client-sns';
import { SQSClient } from '@aws-sdk/client-sqs';

@Injectable()
export class ClientConfigurationService {
  async getEC2Client(creds: ClientCredentials) {
    const { accessKeyId, secretAccessKey, region } = creds;
    return new EC2Client({
      credentials: { accessKeyId, secretAccessKey },
      region,
    });
  }

  async getPricingClient(creds: ClientCredentials) {
    const { accessKeyId, secretAccessKey, region } = creds;
    return new PricingClient({
      credentials: { accessKeyId, secretAccessKey },
      region,
    });
  }

  async getCloudWatchClient(creds: ClientCredentials) {
    const { accessKeyId, secretAccessKey, region } = creds;
    return new CloudWatchClient({
      credentials: { accessKeyId, secretAccessKey },
      region,
    });
  }

  async getS3Client(creds: ClientCredentials) {
    const { accessKeyId, secretAccessKey, region } = creds;
    return new S3Client({
      credentials: { accessKeyId, secretAccessKey },
      region,
    });
  }

  async getEFSClient(creds: ClientCredentials) {
    const { region, accessKeyId, secretAccessKey } = creds;
    return new EFSClient({
      region: region,
      credentials: { accessKeyId, secretAccessKey },
    });
  }

  async getS3GlacierClient(creds: ClientCredentials) {
    const { region, accessKeyId, secretAccessKey } = creds;
    return new GlacierClient({
      region: region,
      credentials: { accessKeyId, secretAccessKey },
    });
  }
  async getFSxClient(creds: ClientCredentials) {
    const { region, accessKeyId, secretAccessKey } = creds;
    return new FSxClient({
      region,
      credentials: { accessKeyId, secretAccessKey },
    });
  }
  async getECRClient(creds: ClientCredentials) {
    const { region, accessKeyId, secretAccessKey } = creds;
    return new ECRClient({
      region,
      credentials: { accessKeyId, secretAccessKey },
    });
  }
  async getEKSClient(creds: ClientCredentials) {
    const { region, accessKeyId, secretAccessKey } = creds;
    return new EKSClient({
      region,
      credentials: { accessKeyId, secretAccessKey },
    });
  }
  async getRDSClient(creds: ClientCredentials) {
    const { region, accessKeyId, secretAccessKey } = creds;
    return new RDSClient({
      region,
      credentials: { accessKeyId, secretAccessKey },
    });
  }
  async getResourceGroupClient(creds: ClientCredentials) {
    const { region, accessKeyId, secretAccessKey } = creds;
    return new ResourceGroupsClient({
      region,
      credentials: { accessKeyId, secretAccessKey },
    });
  }
  async getCloudTrailClient(creds: ClientCredentials) {
    const { region, accessKeyId, secretAccessKey } = creds;
    return new CloudTrailClient({
      region,
      credentials: { accessKeyId, secretAccessKey },
    });
  }

  async getAWSLoadBalancerClient(creds: ClientCredentials) {
    const { region, accessKeyId, secretAccessKey } = creds;
    return new ElasticLoadBalancingClient({
      region,
      credentials: { accessKeyId, secretAccessKey },
    });
  }
  async getAWSLoadBalancerV2Client(creds: ClientCredentials) {
    const { region, accessKeyId, secretAccessKey } = creds;
    return new ElasticLoadBalancingV2Client({
      region,
      credentials: { accessKeyId, secretAccessKey },
    });
  }
  async getBeanStalkClient(creds: ClientCredentials) {
    const { region, accessKeyId, secretAccessKey } = creds;
    return new ElasticBeanstalkClient({
      region,
      credentials: { accessKeyId, secretAccessKey },
    });
  }
  async getECSClient(creds: ClientCredentials) {
    const { region, accessKeyId, secretAccessKey } = creds;
    return new ECSClient({
      region,
      credentials: { accessKeyId, secretAccessKey },
    });
  }
  async getSNSClient(creds: ClientCredentials) {
    const { region, accessKeyId, secretAccessKey } = creds;
    return new SNSClient({
      region,
      credentials: { accessKeyId, secretAccessKey },
    });
  }
  async getSQSClient(creds: ClientCredentials) {
    const { region, accessKeyId, secretAccessKey } = creds;
    return new SQSClient({
      region,
      credentials: { accessKeyId, secretAccessKey },
    });
  }

  async getEMRClient(creds: ClientCredentials) {
    const { region, accessKeyId, secretAccessKey } = creds;
    return new EMRClient({
      region,
      credentials: { accessKeyId, secretAccessKey },
    });
  }
  async getDynamoDbClient(creds: ClientCredentials) {
    const { region, accessKeyId, secretAccessKey } = creds;
    const dynamoDbClient = new DynamoDBClient({
      region,
      credentials: { accessKeyId, secretAccessKey },
    });
    return dynamoDbClient;
  }
}

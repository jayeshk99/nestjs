import { Injectable, Logger } from '@nestjs/common';

import * as AWS from 'aws-sdk';
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
@Injectable()
export class ClientConfigurationService {
  async getEC2Client(creds: ClientCredentials): Promise<EC2Client> {
    const { accessKeyId, secretAccessKey, region } = creds;
    const ec2Client = new EC2Client({
      credentials: { accessKeyId, secretAccessKey },
      region,
    });
    return ec2Client;
  }

  async getPricingClient(creds: ClientCredentials): Promise<PricingClient> {
    const { accessKeyId, secretAccessKey, region } = creds;
    const pricingClient = new PricingClient({
      credentials: { accessKeyId, secretAccessKey },
      region,
    });

    return pricingClient;
  }

  async getCloudWatchClient(
    creds: ClientCredentials,
  ): Promise<CloudWatchClient> {
    const { accessKeyId, secretAccessKey, region } = creds;
    const cloudWatchClient = new CloudWatchClient({
      credentials: { accessKeyId, secretAccessKey },
      region,
    });

    return cloudWatchClient;
  }

  async getS3Client(creds: ClientCredentials): Promise<S3Client> {
    const { accessKeyId, secretAccessKey, region } = creds;
    const s3Client = new S3Client({
      credentials: { accessKeyId, secretAccessKey },
      region,
    });
    return s3Client;
  }

  async getEFSClient(creds: ClientCredentials): Promise<EFSClient> {
    const { region, accessKeyId, secretAccessKey } = creds;
    const efsClient = new EFSClient({
      region: region,
      credentials: { accessKeyId, secretAccessKey },
    });
    return efsClient;
  }

  async getS3GlacierClient(creds: ClientCredentials): Promise<GlacierClient> {
    const { region, accessKeyId, secretAccessKey } = creds;
    const s3GlacierClient = new GlacierClient({
      region: region,
      credentials: { accessKeyId, secretAccessKey },
    });
    return s3GlacierClient;
  }
  async getFsxClient(creds: ClientCredentials): Promise<FSxClient> {
    const { region, accessKeyId, secretAccessKey } = creds;
    const fsxClient = new FSxClient({
      region,
      credentials: { accessKeyId, secretAccessKey },
    });
    return fsxClient;
  }
  async getEcrClient(creds: ClientCredentials): Promise<ECRClient> {
    const { region, accessKeyId, secretAccessKey } = creds;
    const ecrClient = new ECRClient({
      region,
      credentials: { accessKeyId, secretAccessKey },
    });
    return ecrClient;
  }
  async getEksClient(creds: ClientCredentials): Promise<EKSClient> {
    const { region, accessKeyId, secretAccessKey } = creds;
    const eksClient = new EKSClient({
      region,
      credentials: { accessKeyId, secretAccessKey },
    });
    return eksClient;
  }
  async getRdsClient(creds: ClientCredentials): Promise<RDSClient> {
    const { region, accessKeyId, secretAccessKey } = creds;
    const rdsClient = new RDSClient({
      region,
      credentials: { accessKeyId, secretAccessKey },
    });
    return rdsClient;
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
}

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
      region,
      credentials: { accessKeyId, secretAccessKey },
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

  async getFsxClient(creds: ClientCredentials): Promise<FSxClient> {
    const { region, accessKeyId, secretAccessKey } = creds;
    const fsxClient = new FSxClient({
      region,
      credentials: { accessKeyId, secretAccessKey },
    });
    return fsxClient;
  }
  async getRdsClient(creds: ClientCredentials): Promise<RDSClient> {
    const { region, accessKeyId, secretAccessKey } = creds;
    const rdsClient = new RDSClient({
      region,
      credentials: { accessKeyId, secretAccessKey },
    });
    return rdsClient;
  }
}

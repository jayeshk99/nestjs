import { Injectable, Logger } from '@nestjs/common';

import * as AWS from 'aws-sdk';
import { ClientCredentials } from '../../common/interfaces/awsClient.interface';
@Injectable()
export class ClientConfigurationService {
  private readonly logger = new Logger(ClientConfigurationService.name);

  async initialConfiguration(
    accessKeyId: string,
    secretAccessKeyId: string,
    region: string,
  ) {
    AWS.config.update({
      region: region,
      credentials: {
        accessKeyId: accessKeyId,
        secretAccessKey: secretAccessKeyId,
      },
    });
  }

  async getEC2Client(creds: ClientCredentials) {
    const { accessKeyId, secretAccessKeyId, region } = creds;
    await this.initialConfiguration(accessKeyId, secretAccessKeyId, region);

    const ec2Client = new AWS.EC2();

    return ec2Client;
  }

  async getPricingClient(creds: ClientCredentials) {
    const { accessKeyId, secretAccessKeyId, region } = creds;

    await this.initialConfiguration(accessKeyId, secretAccessKeyId, region);

    const pricingClient = new AWS.Pricing();

    return pricingClient;
  }

  async getCloudWatchClient(creds: ClientCredentials) {
    const { accessKeyId, secretAccessKeyId, region } = creds;

    await this.initialConfiguration(accessKeyId, secretAccessKeyId, region);

    const cloudWatchClient = new AWS.CloudWatch();

    return cloudWatchClient;
  }

  async getS3Client(credentials: ClientCredentials): Promise<AWS.S3> {
    const s3Client = new AWS.S3({
      region: credentials.region,
      credentials: {
        accessKeyId: credentials.accessKeyId,
        secretAccessKey: credentials.secretAccessKeyId,
      },
    });
    return s3Client;
  }

  async getEFSClient(credentials: ClientCredentials): Promise<AWS.EFS> {
    const { region, accessKeyId, secretAccessKeyId, accountId } = credentials;
    const efsClient = new AWS.EFS({
      region: region,
      credentials: { accessKeyId, secretAccessKey: secretAccessKeyId },
    });
    return efsClient;
  }

  async getFsxClient(credentials: ClientCredentials): Promise<AWS.FSx> {
    const fsxClient = new AWS.FSx({
      region: credentials.region,
      credentials: {
        accessKeyId: credentials.accessKeyId,
        secretAccessKey: credentials.secretAccessKeyId,
      },
    });
    return fsxClient;
  }
}

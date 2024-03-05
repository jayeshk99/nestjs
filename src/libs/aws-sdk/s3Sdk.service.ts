import { Injectable } from '@nestjs/common';
import { AwsClientRequest } from 'src/common/interfaces/awsClient.interface';
import { ClientConfigurationService } from './clientConfiguration.service';
import * as AWS from 'aws-sdk';
import { ListBucketsOutput } from 'aws-sdk/clients/s3';
@Injectable()
export class S3SdkService {
  async listBuckets(s3Client: AWS.S3): Promise<ListBucketsOutput> {
    let buckets = await s3Client.listBuckets().promise();
    buckets.Buckets[0];
    return buckets;
  }
  async getBucketLocation(s3Client: AWS.S3, bucketName: string) {
    return await s3Client.getBucketLocation({ Bucket: bucketName }).promise();
  }
}

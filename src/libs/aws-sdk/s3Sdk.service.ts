import { Injectable } from '@nestjs/common';
import {
  GetBucketLocationCommand,
  GetBucketLocationCommandOutput,
  ListBucketsCommand,
  ListBucketsCommandOutput,
  S3Client,
} from '@aws-sdk/client-s3';
@Injectable()
export class S3SdkService {
  async listBuckets(s3Client: S3Client) {
    let { Buckets, Owner } = await s3Client.send(new ListBucketsCommand({}));
    return { Buckets, Owner };
  }
  async getBucketLocation(
    s3Client: S3Client,
    bucketName: string,
  ): Promise<GetBucketLocationCommandOutput> {
    return await s3Client.send(
      new GetBucketLocationCommand({ Bucket: bucketName }),
    );
  }
}

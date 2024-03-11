import { Injectable, Logger } from '@nestjs/common';
import {
  AWS_METRIC_NAMES,
  AWS_NAME_SPACES,
  PRODUCT_CODE,
  REGIONS,
} from 'src/common/constants/constants';
import {
  AWSMetricProps,
  ClientCredentials,
} from 'src/common/interfaces/awsClient.interface';
import {
  FetchServiceReq,
  awsUsageCostProps,
} from 'src/common/interfaces/common.interfaces';
import { ClientConfigurationService } from 'src/libs/aws-sdk/clientConfiguration.service';
import { S3SdkService } from 'src/libs/aws-sdk/s3Sdk.service';
import { AwsHelperService } from '../helper/helper.service';
import { AwsUsageDetailsRepository } from 'src/infra/repositories/awsUsageDetails.repository';
import {
  S3BucketProps,
  S3CostDetailProps,
} from 'src/common/interfaces/s3.interface';
import { S3DetailsRepository } from 'src/infra/repositories/s3Details.repository';

@Injectable()
export class S3Service {
  private readonly logger = new Logger(S3Service.name);
  constructor(
    private readonly clientConfigurationService: ClientConfigurationService,
    private readonly s3SdkService: S3SdkService,
    private readonly awsHelperService: AwsHelperService,
    private readonly awsUsageDetailsRepository: AwsUsageDetailsRepository,
    private readonly s3DetailsRepository: S3DetailsRepository,
  ) {}
  async fetchS3Details(data: ClientCredentials) {
    try {
      this.logger.log(
        `S3 details job STARTED for account: ${data.accountId} region: ${data.region}`,
      );
      const { accessKeyId, secretAccessKeyId, accountId, region } = data;
      const currentTimestamp = new Date();

      const s3Client = await this.clientConfigurationService.getS3Client(data);
      const cloudWatchClient =
        await this.clientConfigurationService.getCloudWatchClient(data);
      const metricParams: AWSMetricProps = {
        Namespace: AWS_NAME_SPACES.S3,
        MetricName: AWS_METRIC_NAMES.BUCKET_SIZE_BYTES,
        Dimensions: [
          { Name: 'StorageType', Value: 'StandardStorage' },
          { Name: 'BucketName', Value: '' },
        ],
        EndTime: new Date(
          currentTimestamp.setDate(currentTimestamp.getDate() - 1),
        ),
        StartTime: new Date(
          currentTimestamp.setDate(currentTimestamp.getDate() - 1),
        ),
      };
      const bucketsList = await this.s3SdkService.listBuckets(s3Client);
      if (bucketsList && bucketsList.Buckets && bucketsList.Buckets.length) {
        for (let i = 0; i < bucketsList.Buckets.length; i++) {
          const bucket = bucketsList.Buckets[i];
          metricParams.Dimensions[1].Value = bucket.Name;

          const sizeMetricData = await this.awsHelperService.getMetricsData(
            metricParams,
            cloudWatchClient,
          );
          let size: number = 0;
          if (sizeMetricData?.length) {
            size = sizeMetricData[0] && sizeMetricData[0]['Maximum'];
          }
          const { currencyCode, s3PerDayCost, storagePrevMonthCost } =
            await this.s3CostDetails({
              bucketName: bucket.Name,
              accountId: accountId,
            });
          const s3BucketFields: S3BucketProps = {
            storageOwner: bucketsList.Owner.DisplayName,
            storageName: bucket.Name,
            createdOn: bucket.CreationDate,
            accountId: accountId,
            size: size,
            region: region,
            unit: 'Bytes',
            pricePerHour: (s3PerDayCost && s3PerDayCost / 24) || 0,
            currencyCode:
              (currencyCode && currencyCode?.billing_currency) || '',
            storagePricePerMonth: storagePrevMonthCost || 0,
          };
          const regionResult = await this.s3SdkService.getBucketLocation(
            s3Client,
            bucket.Name,
          );
          s3BucketFields.region =
            regionResult.LocationConstraint || REGIONS.US_EAST_1;
          // TODO: make this repeated find and update logic generic
          const isBucketExist =
            await this.s3DetailsRepository.findS3Bucket(s3BucketFields);
          if (isBucketExist) {
            await this.s3DetailsRepository.updateS3Bucket(
              isBucketExist.id,
              s3BucketFields,
            );
          } else {
            await this.s3DetailsRepository.createS3Bucket(s3BucketFields);
          }

          // TODO: Syncing tags for s3 bucket
          // TODO: job success status
        }
      }
      this.logger.log(
        `S3 Details job COMPLETED for account: ${data.accountId} region: ${data.region}`,
      );
    } catch (error) {
      console.log(error);
      this.logger.log(
        `Error in getting s3 Details for account: ${data.accountId} region: ${data.region}: Error: ${error}`,
      );
    }
  }

  async s3CostDetails(data: S3CostDetailProps) {
    try {
      const { bucketName, accountId } = data;
      const s3UsageDetails =
        await this.awsUsageDetailsRepository.getOneDayCostOfResource({
          resourceId: bucketName,
          productCode: PRODUCT_CODE.S3,
          awsAccountId: accountId,
        });

      const currencyCode =
        await this.awsUsageDetailsRepository.getAwsCurrencyCode(accountId);

      const s3PerDayCost = s3UsageDetails && s3UsageDetails.unBlendedCost;

      const currentDate = new Date().toISOString().split('T')[0];
      const currentBillDate = new Date(currentDate);
      const startDate = new Date(
        currentBillDate.setDate(currentBillDate.getDate() - 29),
      )
        .toISOString()
        .split('T')[0];

      const usageCostFields: awsUsageCostProps = {
        resourceId: bucketName,
        prouductCode: PRODUCT_CODE.S3,
        startTime: startDate,
        endTime: currentDate,
        awsAccountId: accountId,
      };

      const storageMonthlyCost =
        await this.awsUsageDetailsRepository.getAwsStorageUsageCost(
          usageCostFields,
        );
      const storagePrevMonthCost: number = storageMonthlyCost?.costSum;
      return { currencyCode, s3PerDayCost, storagePrevMonthCost };
    } catch (error) {
      this.logger.log(
        `Error in getting cost details for s3 for account: ${data.accountId} ${error}`,
      );
    }
  }
}

// 442	"386152433177"	"devops+cloudforestxdev"	"2022-11-22 09:21:29+00"	"us-east-1"	1	0	"2022-11-23 02:00:04.006+00"	"2024-03-05 07:39:08.996495+00"	3813315	"386152433177"	"Bytes"	0	"USD"	0.0017572015000000005		466

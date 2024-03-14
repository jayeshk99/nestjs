import { StringFilter } from 'aws-sdk/clients/securityhub';

export interface FetchServiceReq {
  accountId: string;
  region: string;
}

export interface AWSPricingReq {
  resourceId?: string;
  productCode: string;
  awsAccountId: string;
}

export interface awsUsageCostProps {
  resourceId: string;
  prouductCode: string;
  awsAccountId: string;
  startTime: string;
  endTime: string;
}
export interface UtilizationOutput {
  Average?: number;
  Maximum?: number;
  Minimum?: number;
  Timestamp?: Date;
  Unit?: string;
  Sum?: number;
  SampleCount?: number;
  metricName: string;
  ExtendedStatistics?: any;
  accountId: string;
  dbInstanceIdentifier: string;
}
export interface awsResourceAvailableprops {
  resourceId: string;
  prouductCode: string;
  awsAccountId: string;
  billingDate: string;
}
export interface JobRequest {
  accountId: string;
}

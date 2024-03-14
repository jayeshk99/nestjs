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
  average?: number;
  maximum?: number;
  minimum?: number;
  timestamp?: Date;
  unit?: string;
  sum?: number;
  sampleCount?: number;
  metricName: string;
  extendedStatistics?: any;
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

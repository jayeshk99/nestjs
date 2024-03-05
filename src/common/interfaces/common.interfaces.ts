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

export interface JobRequest {
  accountId: string;
}

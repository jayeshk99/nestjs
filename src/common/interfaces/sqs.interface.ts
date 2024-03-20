export interface SQSProps{
    id?: number;
  accountId?: string;
  sqsName?: string;
  sqsTier?: string;
  arn?: string;
  region?: string;
  updatedOn?: Date;
  createdOn?: Date;
  isActive?: number;
  type?: number;
  unusedCreatedOn?: Date;
  isDisabled?: number;
  currencyCode?: string;
  monthlyCost?: number;
  queueUrl?: string;
}
export interface S3BucketProps {
  id?: number;
  accountId?: string;
  storageName?: string;
  storageOwner?: string;
  createdOn?: Date;
  region?: string;
  isActive?: number;
  type?: number;
  unusedCreatedOn?: Date;
  isDisabled?: number;
  unit?: string;
  currencyCode?: string;
  predictedMonthlyCost?: number;
  lastModified?: string;
  size?: number;
  pricePerHour?: number;
  storagePricePerMonth?: number;
}

export interface S3CostDetailProps {
  bucketName: string;
  accountId: string;
}

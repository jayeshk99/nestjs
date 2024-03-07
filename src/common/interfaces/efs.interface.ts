export interface EFSProps {
  id?: number;
  accountId?: string;
  fileSystemId?: string;
  fileSystemArn?: string;
  storageName?: string;
  storageOwner?: string;
  capacityUsed?: number;
  createdOn?: Date;
  region?: string;
  status?: string;
  isActive?: number;
  type?: number;
  unusedCreatedOn?: Date;
  isDisabled?: number;
  unit?: string;
  currencyCode?: string;
  predictedMonthlyCost?: number;
  lastModified?: string;
  pricePerHour?: number;
  storagePricePerMonth?: number;
}

export interface EfsCostDetailProps {
  fileSystemArn: string;
  accountId: string;
}

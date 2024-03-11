export interface FsxFileSystemProps {
  id?: number;
  accountId?: string;
  fileSystemId?: string;
  resourceArn?: string;
  fileSystemType?: string;
  storageName?: string;
  storageOwner?: string;
  storageType?: string;
  storageCapacity?: number;
  unit?: string;
  vpcId?: string;
  createdOn?: Date;
  region?: string;
  status?: string;
  isActive?: number;
  isDisabled?: number;
  currencyCode?: string;
  pricePerHour?: number;
  storagePricePerMonth?: number;
  createdBy?: number;
  updatedBy?: number;
  ipAddress?: string;
}

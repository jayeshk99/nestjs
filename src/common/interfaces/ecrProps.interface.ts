export interface ECRProps {
  id?: number;
  accountId?: string;
  repositoryName?: string;
  repositoryArn?: string;
  imagesCount?: number;
  lastUpdated?: Date;
  createdOn?: Date;
  region?: string;
  monthlyCost?: number;
  currencyCode?: string;
  isDisabled?: number;
  createdBy?: number;
  updatedBy?: number;
  ipAddress?: string;
  isActive?: number;
  type?: number;
}

export interface ecrCostDetailProps {
  repositoryArn: string;
  accountId: string;
}

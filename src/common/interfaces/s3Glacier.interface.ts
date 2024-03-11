export interface ListGlacierInputProps {
  accountId: string;
  limit?: number;
  marker?: string | null;
}

export interface S3GlacierProps {
  id?: number;
  accountId?: string;
  vaultName?: string;
  vaultARN?: string;
  lastInventoryDate?: Date;
  numberOfArchives?: number;
  size?: number;
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
}

export interface EMRProps {
  id?: number;
  accountId?: string;
  clusterArn?: string;
  clusterId?: string;
  instanceCollectionType?: string;
  autoTerminate?: string;
  serviceRole?: string;
  releaseLabel?: string;
  applications?: string;
  state?: string;
  createdOn?: Date;
  visibleToAllUsers?: string;
  region?: string;
  isActive?: number;
  type?: number;
  unusedCreatedOn?: Date;
  isDisabled?: number;
  lastModified?: Date;
  monthlyCost?: number;
  currencyCode?: string;
}

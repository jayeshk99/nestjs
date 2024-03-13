export interface EKSProps {
  id?: number;
  accountId?: string;
  clusterName?: string;
  clusterArn?: string;
  createdOn?: Date;
  region?: string;
  monthlyCost?: number;
  currencyCode?: string;
  isDisabled?: number;
  createdBy?: number;
  updatedBy?: number;
  isActive?: number;
  type?: number;
  ipAddress?: string;
}

export interface EKSCostDetailProps {
  clusterArn: string;
  accountId: string;
}

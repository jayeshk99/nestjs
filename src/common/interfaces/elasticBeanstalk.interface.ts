export interface ElasticBeanStalkProps {
  id?: number;
  accountId?: string;
  appArn?: string;
  appName?: string;
  description?: string;
  versions?: string;
  createdOn?: Date;
  updatedOn?: Date;
  region?: string;
  isActive?: number;
  type?: number;
  unusedCreatedOn?: Date;
  isDisabled?: number;
  currencyCode?: string;
  monthlyCost?: number;
}

export interface AwsContainerInstanceProps {
  id?: number;
  accountId?: string;
  instanceId?: string;
  arn?: string;
  ec2InstanceId?: string;
  agentConnected?: boolean;
  agentUpdateStatus?: string;
  capacityProviderName?: string;
  registeredAt?: Date;
  status?: string;
  statusReason?: string;
  version?: string;
  region?: string;
  isActive?: number;
  type?: number;
  unusedCreatedOn?: Date;
  isDisabled?: number;
  lastModified?: Date;
  agentVersion?: string;
  unit?: string;
  monthlyCost?: number;
  currencyCode?: string;
}

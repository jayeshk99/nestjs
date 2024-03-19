enum LoadBalancerType {
  application,
  classic,
  network,
  gateway,
}
export interface AWSLoadBalancerProps {
  id?: number;
  accountId?: string;
  loadBalancerName?: string;
  loadBalancerArn?: string;
  vpcId?: string;
  loadBalancerType?: string;
  ipAddressType?: string;
  state?: string;
  scheme?: string;
  securityGroups?: string;
  instances?: string;
  createdOn?: Date;
  region?: string;
  isActive?: number;
  type?: number;
  unusedCreatedOn?: Date;
  isDisabled?: number;
  monthlyCost?: number;
  currencyCode?: string;
  loadBalancerVersion?: string;
  targetGroupNames?: string;
}

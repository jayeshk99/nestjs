export interface RDSInstanceProps {
  dbInstanceIdentifier?: string;
  dbInstanceClass?: string;
  engine?: string;
  dbName?: string;
  allocatedStorage?: number;
  engineVersion?: string;
  createdOn?: Date;
  storageType?: string;
  dbInstanceArn?: string;
  readIOPSAvgMax?: number;
  writeIOPSAvgMax?: number;
  dbConnectionsAvgMax?: number;
  region?: string;
  accountId?: string;
  monthlyCost?: number;
  currencyCode?: string;
  instanceStatus?: string;
  databaseEndpoint?: string;
  databasePort?: number;
  backupWindow?: string;
  backupRetentionPeriod?: number;
  dbParameterGroups?: string;
  availabilityZone?: string;
  vpcId?: string;
  multiAZ?: boolean;
  optionGroupMemberships?: string;
  associatedRoles?: string;
  storageEncrypted?: boolean;
  deletionProtection?: boolean;
}

export interface RdsCostDetailProps {
  rdsInstanceArn: string;
  accountId: string;
}

import {
  BeforeInsert,
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({ name: 'RDSDetails' })
export class RDSDetailsEntity {
  @PrimaryGeneratedColumn({ name: 'Id' })
  id: number;

  @Column({ name: 'AccountId' })
  accountId: string;

  @Column({ name: 'DBName' })
  dbName: string;

  @Column({ name: 'DBInstanceIdentifier' })
  dbInstanceIdentifier: string;

  @Column({ name: 'DBInstanceClass' })
  dbInstanceClass: string;

  @Column({ name: 'Engine' })
  engine: string;

  @Column({ name: 'AllocatedStorage' })
  allocatedStorage: string;

  @Column({ name: 'DBInstanceArn' })
  dbInstanceArn: string;

  @Column({ name: 'CurrencyCode' })
  currencyCode: string;

  @Column({ name: 'CreatedOn' })
  createdOn: Date;

  @Column({ name: 'StorageType' })
  storageType: string;

  @Column({ name: 'Region' })
  region: string;

  @Column({ name: 'EngineVersion' })
  engineVersion: string;

  @Column({ name: 'ReadIOPSAvgMax' })
  readIOPSAvgMax: number;

  @Column({ name: 'WriteIOPSAvgMax' })
  writeIOPSAvgMax: number;

  @Column({ name: 'DBConnectionsAvgMax' })
  dbConnectionsAvgMax: number;

  @Column({ name: 'IsActive', default: 1 })
  isActive: number;

  @Column({ name: 'Type', default: 0 })
  type: number;

  @Column({ name: 'UnusedCreatedOn' })
  unusedCreatedOn: Date;

  @Column({ name: 'IsDisabled', default: 0 })
  isDisabled: number;

  @Column({ name: 'MonthlyCost', default: 0 })
  monthlyCost: number;

  @Column({ name: 'LastUpdated' })
  lastUpdated: Date;

  @Column({ name: 'CreatedBy' })
  createdBy: number;

  @Column({ name: 'UpdatedBy' })
  updatedBy: number;

  @Column({ name: 'IpAddress' })
  ipAddress: string;

  @Column({ name: 'InstanceStatus' })
  instanceStatus: string;

  @Column({ name: 'DatabaseEndpoint' })
  databaseEndpoint: string;

  @Column({ name: 'DatabasePort' })
  databasePort: number;

  @Column({ name: 'BackupWindow' })
  backupWindow: string;

  @Column({ name: 'BackupRetentionPeriod' })
  backupRetentionPeriod: number;

  @Column({ name: 'DBParameterGroups' })
  dbParameterGroups: string;

  @Column({ name: 'AvailabilityZone' })
  availabilityZone: string;

  @Column({ name: 'VPCId' })
  vpcId: string;

  @Column({ name: 'MultiAZ' })
  multiAZ: boolean;

  @Column({ name: 'OptionGroupMemberships' })
  optionGroupMemberships: string;

  @Column({ name: 'AssociatedRoles' })
  associatedRoles: string;

  @Column({ name: 'StorageEncrypted' })
  storageEncrypted: boolean;

  @Column({ name: 'DeletionProtection' })
  deletionProtection: boolean;

  @CreateDateColumn({ name: 'createdAt', type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updatedAt', type: 'timestamp' })
  updatedAt: Date;

  @BeforeInsert()
  updateTime() {
    this.createdAt = new Date();
    this.updatedAt = new Date();
  }
}

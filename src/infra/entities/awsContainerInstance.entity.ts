import {
  BeforeInsert,
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({ name: 'AwsContainerInstance' })
export class AwsContainerInstanceEntity {
  @PrimaryGeneratedColumn({ name: 'Id' })
  id: number;

  @Column({ name: 'AccountId' })
  accountId: string;

  @Column({ name: 'InstanceId' })
  instanceId: string;

  @Column({ name: 'Arn' })
  arn: string;

  @Column({ name: 'EC2InstanceId' })
  ec2InstanceId: string;

  @Column({ name: 'AgentConnected' })
  agentConnected: boolean;

  @Column({ name: 'AgentUpdateStatus' })
  agentUpdateStatus: string;

  @Column({ name: 'AgentVersion' })
  agentVersion: string;

  @Column({ name: 'CapacityProviderName' })
  capacityProviderName: string;

  @Column({ name: 'RegisteredAt', type: 'timestamp' })
  registeredAt: Date;

  @Column({ name: 'Status' })
  status: string;

  @Column({ name: 'StatusReason' })
  statusReason: string;

  @Column({ name: 'Version' })
  version: string;

  @Column({ name: 'Region' })
  region: string;

  @Column({ name: 'IsActive', default: 1 })
  isActive: number;

  @Column({ name: 'Type', default: 0 })
  type: number;

  @Column({ name: 'UnusedCreatedOn', type: 'timestamp' })
  unusedCreatedOn: Date;

  @Column({ name: 'IsDisabled', default: 0 })
  isDisabled: number;

  @Column({ name: 'CurrencyCode' })
  currencyCode: string;

  @Column({ name: 'MonthlyCost', default: 0 })
  monthlyCost: number;

  @Column({ name: 'LastModified', type: 'timestamp' })
  lastModified: Date;

  @Column({ name: 'CreatedBy' })
  createdBy: number;

  @Column({ name: 'UpdatedBy' })
  updatedBy: number;

  @Column({ name: 'IpAddress' })
  ipAddress: string;

  @CreateDateColumn({ name: 'createdAt', type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updatedAt', type: 'timestamptz' })
  updatedAt: Date;

  @BeforeInsert()
  updateTime() {
    this.createdAt = new Date();
    this.updatedAt = new Date();
  }
}

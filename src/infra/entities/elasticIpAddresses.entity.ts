import {
  BeforeInsert,
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({ name: 'ElasticIPAddresses' })
export class ElasticIPAddress {
  @PrimaryGeneratedColumn({ name: 'Id' })
  id: number;

  @Column({ name: 'AccountId' })
  accountId: string;

  @Column({ name: 'ElasticIPName' })
  elasticIPName: string;

  @Column({ name: 'IPAddress' })
  ipAddress: string;

  @Column({ name: 'Location' })
  location: string;

  @Column({ name: 'InstanceId' })
  instanceId: string;

  @Column({ name: 'NetworkInterfaceId' })
  networkInterfaceId: string;

  @Column({ name: 'AssociationId' })
  associationId: string;

  @Column({ name: 'IsActive', default: 1 })
  isActive: number;

  @Column({ name: 'Type', default: 0 })
  type: number;

  @Column({ name: 'CurrencyCode' })
  currencyCode: string;

  @Column({ name: 'UnusedCreatedOn' })
  unusedCreatedOn: Date;

  @Column({ name: 'IsDisabled', default: 0 })
  isDisabled: number;

  @Column({ name: 'PublicIpv4Pool' })
  publicIpv4Pool: string;

  @Column({ name: 'MonthlyCost', default: 0 })
  monthlyCost: number;

  @Column({ name: 'AllocationId' })
  allocationId: string;

  @Column({ name: 'CreatedBy' })
  createdBy: number;

  @Column({ name: 'UpdatedBy' })
  updatedBy: number;

  @Column({ name: 'UserIpAddress' })
  userIpAddress: string;

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

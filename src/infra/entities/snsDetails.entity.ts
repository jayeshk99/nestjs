import {
  BeforeInsert,
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({ name: 'SNSDetails' })
export class SNSDetailsEntity {
  @PrimaryGeneratedColumn({ name: 'Id' })
  id: number;

  @Column({ name: 'AccountId' })
  accountId: string;

  @Column({ name: 'SnsName' })
  snsName: string;

  @Column({ name: 'SnsTier' })
  snsTier: string;

  @Column({ name: 'ARN' })
  arn: string;

  @Column({ name: 'Owner' })
  owner: string;

  @Column({ name: 'SubscriptionsPending' })
  subscriptionsPending: string;

  @Column({ name: 'SubscriptionsConfirmed' })
  subscriptionsConfirmed: string;

  @Column({ name: 'DisplayName' })
  displayName: string;

  @Column({ name: 'Region' })
  region: string;

  @Column({ name: 'SubscriptionsDeleted' })
  subscriptionsDeleted: string;

  @Column({ name: 'LastModified' })
  lastModified: Date;

  @Column({ name: 'CurrencyCode' })
  currencyCode: string;

  @Column({ name: 'MonthlyCost', default: 0 })
  monthlyCost: number;

  @Column({ name: 'IsActive', default: 1 })
  isActive: number;

  @Column({ name: 'Type', default: 0 })
  type: number;

  @Column({ name: 'UnusedCreatedOn' })
  unusedCreatedOn: Date;

  @Column({ name: 'IsDisabled', default: 0 })
  isDisabled: number;

  @Column({ name: 'CreatedBy' })
  createdBy: number;

  @Column({ name: 'UpdatedBy' })
  updatedBy: number;

  @Column({ name: 'IpAddress' })
  ipAddress: string;

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

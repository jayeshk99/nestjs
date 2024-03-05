import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  BeforeInsert,
} from 'typeorm';

@Entity({ name: 'AWSUsageDetails' })
export class AWSUsageDetailsEntity {
  @PrimaryGeneratedColumn({ name: 'Id' })
  id: number;

  @Column({ name: 'PayerAccountId' })
  payerAccountId: string;

  @Column({ name: 'BillingPeriodStartDate' })
  billingPeriodStartDate: Date;

  @Column({ name: 'BillingPeriodEndDate' })
  billingPeriodEndDate: Date;

  @Column({ name: 'UnBlendedCost' })
  unBlendedCost: number;

  @Column({ name: 'LineItemType' })
  lineItemType: string;

  @Column({ name: 'UsageAccountId' })
  usageAccountId: string;

  @Column({ name: 'UsageStartDate' })
  usageStartDate: Date;

  @Column({ name: 'UsageEndDate' })
  usageEndDate: Date;

  @Column({ name: 'ProductCode' })
  productCode: string;

  @Column({ name: 'UsageType' })
  usageType: string;

  @Column({ name: 'Operation' })
  operation: string;

  @Column({ name: 'BillingDate' })
  billingDate: Date;

  @Column({ name: 'ResourceId' })
  resourceId: string;

  @Column({ name: 'ResourceUsageAmount' })
  resourceUsageAmount: number;

  @Column({ name: 'CurrencyCode' })
  currencyCode: string;

  @Column({ name: 'LineItemDescription' })
  lineItemDescription: string;

  @Column({ name: 'ProductRegionCode' })
  productRegionCode: string;

  @Column({ name: 'ProductRegion' })
  productRegion: string;

  @Column({ name: 'InstanceType' })
  instanceType: string;

  @Column({ name: 'InstanceTypeFamily' })
  instanceTypeFamily: string;

  @Column({ name: 'ProductMemory' })
  productMemory: string;

  @Column({ name: 'OperatingSystem' })
  operatingSystem: string;

  @Column({ name: 'ProductServiceCode' })
  productServiceCode: string;

  @Column({ name: 'ProductServiceName' })
  productServiceName: string;

  @Column({ name: 'ProductSku' })
  productSku: string;

  @Column({ name: 'ProductRateCode' })
  productRateCode: string;

  @Column({ name: 'RateId' })
  rateId: string;

  @Column({ name: 'SubscriptionId' })
  subscriptionId: string;

  @Column({ name: 'BillingEntity' })
  billingEntity: string;

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

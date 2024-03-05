import {
  BeforeInsert,
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({ name: 'AWSLoadBalancers' })
export class AWSLoadBalancerEntity {
  @PrimaryGeneratedColumn({ name: 'Id' })
  id: number;

  @Column({ name: 'AccountId' })
  accountId: string;

  @Column({ name: 'LoadBalancerName' })
  loadBalancerName: string;

  @Column({ name: 'LoadBalancerArn' })
  loadBalancerArn: string;

  @Column({ name: 'VpcId' })
  vpcId: string;

  @Column({ name: 'LoadBalancerType' })
  loadBalancerType: string;

  @Column({ name: 'CurrencyCode' })
  currencyCode: string;

  @Column({ name: 'IpAddressType' })
  ipAddressType: string;

  @Column({ name: 'State' })
  state: string;

  @Column({ name: 'Scheme' })
  scheme: string;

  @Column({ name: 'SecurityGroups' })
  securityGroups: string;

  @Column({ name: 'Instances' })
  instances: string;

  @CreateDateColumn({ name: 'CreatedOn', type: 'timestamp' })
  createdOn: Date;

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

  @Column({ name: 'MonthlyCost', default: 0 })
  monthlyCost: number;

  @Column({ name: 'LoadBalancerVersion' })
  loadBalancerVersion: string;

  @Column({ name: 'TargetGroupNames' })
  targetGroupNames: string;

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

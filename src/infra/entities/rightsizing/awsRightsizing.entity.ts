import {
  BeforeInsert,
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({ name: 'AWSRightSizing' })
export class AWSRightSizingEntity {
  @PrimaryGeneratedColumn({ name: 'Id' })
  id: number;

  @Column({ name: 'InstanceId' })
  instanceId: string;

  @Column({ name: 'Instance' })
  instance: string;

  @Column({ name: 'CurrentHourlyCost', type: 'float', default: 0 })
  currentHourlyCost: number;

  @Column({ name: 'ProjectedHourlyCost', type: 'float', default: 0 })
  projectedHourlyCost: number;

  @Column({ name: 'PossibleHourlySavings', type: 'float', default: 0 })
  possibleHourlySavings: number;

  @Column({ name: 'Platform' })
  platform: string;

  @Column({ name: 'InstanceType' })
  instanceType: string;

  @Column({ name: 'Recommended' })
  recommended: string;

  @Column({ name: 'Type' })
  type: number;

  @Column({ name: 'AvgCPU', type: 'float', default: 0.0 })
  avgCPU: number;

  @Column({ name: 'AvgMemory', type: 'float' })
  avgMemory: number;

  @Column({ name: 'AvgNetworkIn', type: 'float' })
  avgNetworkIn: number;

  @Column({ name: 'AvgNetworkOut', type: 'float' })
  avgNetworkOut: number;

  @Column({ name: 'PeakCPU', type: 'float' })
  peakCPU: number;

  @Column({ name: 'PeakMem', type: 'float' })
  peakMem: number;

  @Column({ name: 'UtilizationScore' })
  utilizationScore: number;

  @Column({ name: 'Status' })
  status: string;

  @Column({ name: 'AccountId' })
  accountId: string;

  @Column({ name: 'IsDisabled', default: 0 })
  isDisabled: number;

  @Column({ name: 'CurrencyCode' })
  currencyCode: string;

  @Column({ name: 'InstanceLifecycle' })
  instanceLifecycle: string;

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

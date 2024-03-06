import {
  BeforeInsert,
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({ name: 'IdleInstanceDetails' })
export class IdleInstanceDetailsEntity {
  @PrimaryGeneratedColumn({ name: 'Id' })
  id: number;

  @Column({ name: 'InstanceId' })
  instanceId: string;

  @Column({ name: 'InstanceName' })
  instanceName: string;

  @Column({ name: 'InstanceType' })
  instanceType: string;

  @Column({ name: 'Region' })
  region: string;

  @Column({ name: 'CPUUtil', type: 'float' })
  cpuUtil: number;

  @Column({ name: 'Unit' })
  unit: string;

  @Column({ name: 'CurrencyCode' })
  currencyCode: string;

  @Column({ name: 'PredictedMonthlyCost', type: 'float' })
  predictedMonthlyCost: number;

  @Column({ name: 'IsDisabled', default: 0 })
  isDisabled: number;

  @Column({ name: 'AccountId' })
  accountId: string;

  @Column({ name: 'IsActive', default: 1 })
  isActive: number;

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

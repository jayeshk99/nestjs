import {
  BeforeInsert,
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({ name: 'RDSRightSizing' })
export class RDSRightSizingEntity {
  @PrimaryGeneratedColumn({ name: 'Id' })
  id: number;

  @Column({ name: 'AccountId' })
  accountId: string;

  @Column({ name: 'DBInstanceIdentifier' })
  dbInstanceIdentifier: string;

  @Column({ name: 'DBInstanceClass' })
  dbInstanceClass: string;

  @Column({ name: 'Engine' })
  engine: string;

  @Column({ name: 'RecommendedDBInstanceClass' })
  recommendedDBInstanceClass: string;

  @Column({ name: 'CurrentDBClassMonthlyCost' })
  currentDBClassMonthlyCost: number;

  @Column({ name: 'RecommendedDBClassMonthlyCost' })
  recommendedDBClassMonthlyCost: number;

  @Column({ name: 'PosibleSavings' })
  posibleSavings: number;

  @Column({ name: 'AvailabilityZone' })
  availabilityZone: string;

  @Column({ name: 'Timestamp', type: 'timestamp' })
  timestamp: Date;

  @Column({ name: 'SampleCount' })
  sampleCount: number;

  @Column({ name: 'Average' })
  average: number;

  @Column({ name: 'Sum' })
  sum: number;

  @Column({ name: 'Minimum' })
  minimum: number;

  @Column({ name: 'Maximum' })
  maximum: number;

  @Column({ name: 'Unit' })
  unit: string;

  @Column({ name: 'ExtendedStatistics' })
  extendedStatistics: string;

  @Column({ name: 'Status' })
  status: string;

  @Column({ name: 'IsDisabled', default: 0 })
  isDisabled: number;

  @Column({ name: 'CurrencyCode' })
  currencyCode: string;

  @Column({ name: 'DBInstanceId' })
  dbInstanceId: string;

  @Column({ name: 'Type' })
  type: number;

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

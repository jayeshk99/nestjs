import {
  BeforeInsert,
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({ name: 'RDSCPUUtilization' })
export class RDSCPUUtilizationEntity {
  @PrimaryGeneratedColumn({ name: 'Id' })
  id: number;

  @Column({ name: 'AccountId' })
  accountId: string;

  @Column({ name: 'DBInstanceIdentifier' })
  dbInstanceIdentifier: string;

  @Column({ name: 'Timestamp', type: 'timestamp' })
  timestamp: Date;

  @Column({ name: 'Average' })
  average: number;

  @Column({ name: 'Minimum' })
  minimum: number;

  @Column({ name: 'Maximum' })
  maximum: number;

  @Column({ name: 'Unit' })
  unit: string;

  @Column({ name: 'MetricName' })
  metricName: string;

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

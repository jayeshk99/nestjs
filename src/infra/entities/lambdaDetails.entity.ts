import {
  BeforeInsert,
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({ name: 'LambdaDetails' })
export class LambdaDetailsEntity {
  @PrimaryGeneratedColumn({ name: 'Id' })
  id: number;

  @Column({ name: 'AccountId' })
  accountId: string;

  @Column({ name: 'FunctionName' })
  functionName: string;

  @Column({ name: 'FunctionArn' })
  functionArn: string;

  @Column({ name: 'LastUpdated' })
  lastUpdated: Date;

  @Column({ name: 'CurrencyCode' })
  currencyCode: string;

  @Column({ name: 'CreatedOn' })
  createdOn: Date;

  @Column({ name: 'Region' })
  region: string;

  @Column({ name: 'MonthlyCost', default: 0 })
  monthlyCost: number;

  @Column({ name: 'CreatedBy' })
  createdBy: number;

  @Column({ name: 'UpdatedBy' })
  updatedBy: number;

  @Column({ name: 'IpAddress' })
  ipAddress: string;

  @Column({ name: 'IsActive', default: 1 })
  isActive: number;

  @Column({ name: 'Type', default: 0 })
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

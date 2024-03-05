import {
  BeforeInsert,
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({ name: 'ElasticBeanstalkDetails' })
export class ElasticBeanstalkEntity {
  @PrimaryGeneratedColumn({ name: 'Id' })
  id: number;

  @Column({ name: 'AccountId' })
  accountId: string;

  @Column({ name: 'AppArn' })
  appArn: string;

  @Column({ name: 'AppName' })
  appName: string;

  @Column({ name: 'Description' })
  description: string;

  @Column({ name: 'Versions' })
  versions: string;

  @Column({ name: 'CurrencyCode' })
  currencyCode: string;

  @Column({ name: 'CreatedOn' })
  createdOn: Date;

  @Column({ name: 'UpdatedOn' })
  updatedOn: Date;

  @Column({ name: 'Region' })
  region: string;

  @Column({ name: 'IsActive', default: 1 })
  isActive: number;

  @Column({ name: 'Type', default: 0 })
  type: number;

  @Column({ name: 'UnusedCreatedOn' })
  unusedCreatedOn: Date;

  @Column({ name: 'IsDisabled', default: 0 })
  isDisabled: number;

  @Column({ name: 'MonthlyCost', default: 0 })
  monthlyCost: number;

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

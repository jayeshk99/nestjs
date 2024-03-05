import {
  BeforeInsert,
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({ name: 'S3BucketDetails' })
export class S3BucketEntity {
  @PrimaryGeneratedColumn({ name: 'Id' })
  id: number;

  @Column({ name: 'AccountId' })
  accountId: string;

  @Column({ name: 'StorageName' })
  storageName: string;

  @Column({ name: 'StorageOwner' })
  storageOwner: string;

  @Column({ name: 'CreatedOn', type: 'timestamp' })
  createdOn: Date;

  @Column({ name: 'Region' })
  region: string;

  @Column({ name: 'IsActive', default: 1 })
  isActive: number;

  @Column({ name: 'IsDisabled', default: 0 })
  isDisabled: number;

  @Column({ name: 'Size', default: 0 })
  size: number;

  @Column({ name: 'Unit' })
  unit: string;

  @Column({ name: 'PricePerHour', default: 0 })
  pricePerHour: number;

  @Column({ name: 'CurrencyCode' })
  currencyCode: string;

  @Column({ name: 'StoragePricePerMonth', default: 0 })
  storagePricePerMonth: number;

  @Column({ name: 'CreatedBy' })
  createdBy: number;

  @Column({ name: 'UpdatedBy' })
  updatedBy: number;

  @Column({ name: 'IpAddress' })
  ipAddress: string;

  @CreateDateColumn({
    nullable: true,
    name: 'createdAt',
    type: 'timestamp with time zone',
  })
  createdAt: Date;

  @UpdateDateColumn({
    nullable: true,
    name: 'updatedAt',
    type: 'timestamp with time zone',
  })
  updatedAt: Date;

  @BeforeInsert()
  updateTime() {
    this.createdAt = new Date();
    this.updatedAt = new Date();
  }
}

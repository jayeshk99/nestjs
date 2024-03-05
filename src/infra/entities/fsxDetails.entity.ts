import {
  BeforeInsert,
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({ name: 'FSxDetails' })
export class FSxEntity {
  @PrimaryGeneratedColumn({ name: 'Id' })
  id: number;

  @Column({ name: 'AccountId' })
  accountId: string;

  @Column({ name: 'FileSystemId' })
  fileSystemId: string;

  @Column({ name: 'FileSystemType' })
  fileType: string;

  @Column({ name: 'StorageName' })
  storageName: string;

  @Column({ name: 'StorageOwner' })
  storageOwner: string;

  @Column({ name: 'StorageType' })
  storageType: string;

  @Column({ name: 'StorageCapacity' })
  storageCapacity: number;

  @Column({ name: 'Unit' })
  unit: string;

  @Column({ name: 'VpcId' })
  vpcId: string;

  @Column({ name: 'CurrencyCode' })
  currencyCode: string;

  @Column({ name: 'CreatedOn' })
  createdOn: Date;

  @Column({ name: 'Region' })
  region: string;

  @Column({ name: 'Status' })
  status: string;

  @Column({ name: 'IsActive', default: 1 })
  isActive: number;

  @Column({ name: 'IsDisabled', default: 0 })
  isDisabled: number;

  @Column({ name: 'PricePerHour', default: 0 })
  pricePerHour: number;

  @Column({ name: 'StoragePricePerMonth', default: 0 })
  storagePricePerMonth: number;

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

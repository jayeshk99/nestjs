import {
  BeforeInsert,
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({ name: 'IdleEFS' })
export class IdleEFSEntity {
  @PrimaryGeneratedColumn({ name: 'Id' })
  id: number;

  @Column({ name: 'AccountId' })
  accountId: string;

  @Column({ name: 'FileSystemId' })
  fileSystemId: string;

  @Column({ name: 'FileSystemArn' })
  fileSystemArn: string;

  @Column({ name: 'StorageName' })
  storageName: string;

  @Column({ name: 'StorageOwner' })
  storageOwner: string;

  @Column({ name: 'CapacityUsed' })
  capacityUsed: number;

  @Column({ name: 'CreatedOn' })
  createdOn: Date;

  @Column({ name: 'Region' })
  region: string;

  @Column({ name: 'Status' })
  status: string;

  @Column({ name: 'Unit' })
  unit: string;

  @Column({ name: 'CurrencyCode' })
  currencyCode: string;

  @Column({ name: 'PredictedMonthlyCost' })
  predictedMonthlyCost: number;

  @Column({ name: 'LastModified' })
  lastModified: string;

  @Column({ name: 'IsActive', default: 1 })
  isActive: number;

  @Column({ name: 'IsDisabled', default: 0 })
  isDisabled: number;

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

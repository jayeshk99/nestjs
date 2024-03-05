import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'IdleS3Bucket' })
export class IdleS3BucketEntity {
  @PrimaryGeneratedColumn({ name: 'Id' })
  id: number;

  @Column({ name: 'AccountId' })
  accountId: string;

  @Column({ name: 'StorageName' })
  storageName: string;

  @Column({ name: 'StorageOwner' })
  storageOwner: string;

  @Column({ name: 'CreatedOn' })
  createdOn: Date;

  @Column({ name: 'Region' })
  region: string;

  @Column({ name: 'Unit' })
  unit: string;

  @Column({ name: 'CurrencyCode' })
  currencyCode: string;

  @Column({ name: 'PredictedMonthlyCost', type: 'float' })
  predictedMonthlyCost: number;

  @Column({ name: 'LastModified' })
  lastModified: string;

  @Column({ name: 'IsActive', default: 1 })
  isActive: number;

  @Column({ name: 'IsDisabled', default: 0 })
  isDisabled: number;

  @Column({ name: 'Size', type: 'float', default: 0 })
  size: number;

  @Column({ name: 'CreatedBy' })
  createdBy: number;

  @Column({ name: 'UpdatedBy' })
  updatedBy: number;

  @Column({ name: 'IpAddress' })
  ipAddress: string;
}

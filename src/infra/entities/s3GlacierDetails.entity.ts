import {
  BeforeInsert,
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({ name: 'S3GlacierDetails' })
export class S3GlacierDetailsEntity {
  @PrimaryGeneratedColumn({ name: 'Id' })
  id: number;

  @Column({ name: 'AccountId' })
  accountId: string;

  @Column({ name: 'VaultName' })
  vaultName: string;

  @Column({ name: 'VaultARN' })
  vaultARN: string;

  @Column({ name: 'LastInventoryDate' })
  lastInventoryDate: Date;

  @Column({ name: 'NumberOfArchives' })
  numberOfArchives: number;

  @Column({ name: 'Size' })
  size: number;

  @Column({ name: 'Unit' })
  unit: string;

  @Column({ name: 'CreatedOn' })
  createdOn: Date;

  @Column({ name: 'Region' })
  region: string;

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

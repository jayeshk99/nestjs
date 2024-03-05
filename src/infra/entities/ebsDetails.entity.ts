import {
  BeforeInsert,
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({ name: 'EBSDetails' })
export class EBSEntity {
  @PrimaryGeneratedColumn({ name: 'Id' })
  id: number;

  @Column({ name: 'AccountId' })
  accountId: string;

  @Column({ name: 'VolumeId' })
  volumeId: string;

  @Column({ name: 'EC2InstanceId' })
  ec2InstanceId: string;

  @Column({ name: 'SnapshotId' })
  snapshotId: string;

  @Column({ name: 'Encrypted' })
  encrypted: boolean;

  @Column({ name: 'Size' })
  size: number;

  @Column({ name: 'Unit' })
  unit: string;

  @Column({ name: 'State' })
  state: string;

  @Column({ name: 'VolumeType' })
  volumeType: string;

  @Column({ name: 'DeleteOnTermination' })
  deleteOnTermination: boolean;

  @Column({ name: 'VMState' })
  vmState: string;

  @Column({ name: 'CurrencyCode' })
  currencyCode: string;

  @Column({ name: 'CreatedOn' })
  createdOn: Date;

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

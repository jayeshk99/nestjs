import {
  BeforeInsert,
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({ name: 'AWSAccounts' })
export class AWSAccountsEntity {
  @PrimaryGeneratedColumn()
  Id: number;

  @Column({ name: 'Name' })
  Name: string;

  @Column({ name: 'CloudProvider' })
  CloudProvider: string;

  @Column({ name: 'Location' })
  Location: string;

  @Column({ name: 'PayeeOrganization' })
  PayeeOrganization: string;

  @Column({ name: 'Attributes' })
  Attributes: string;

  @Column({ name: 'AccountId' })
  AccountId: string;

  @Column({ name: 'AccessKeyId' })
  AccessKeyId: string;

  @Column({ name: 'SecretAccessKeyId' })
  SecretAccessKeyId: string;

  @Column({ name: 'Credentials', default: false })
  Credentials: boolean;

  @Column({ name: 'Company' })
  Company: string;

  @Column({ name: 'IAMUserId' })
  IAMUserId: string;

  @Column({ name: 'CreatedBy' })
  CreatedBy: number;

  @Column({ name: 'IsActive', default: 1 })
  IsActive: number;

  @Column({ name: 'AWSLimit', default: 0 })
  AWSLimit: number;

  @Column({ name: 'BucketName' })
  BucketName: string;

  @Column({ name: 'BucketPrefix' })
  BucketPrefix: string;

  @Column({ name: 'BucketRegion' })
  BucketRegion: string;

  @Column({ name: 'UpdatedBy' })
  UpdatedBy: number;

  @Column({ name: 'IpAddress' })
  IpAddress: string;

  @CreateDateColumn({ name: 'createdAt' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updatedAt' })
  updatedAt: Date;

  @BeforeInsert()
  updateTime() {
    this.createdAt = new Date();
    this.updatedAt = new Date();
  }
}

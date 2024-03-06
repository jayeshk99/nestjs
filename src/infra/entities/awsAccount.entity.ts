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
  @PrimaryGeneratedColumn({ name: 'Id' })
  id: number;

  @Column({ name: 'Name' })
  name: string;

  @Column({ name: 'CloudProvider' })
  cloudProvider: string;

  @Column({ name: 'Location' })
  location: string;

  @Column({ name: 'PayeeOrganization' })
  payeeOrganization: string;

  @Column({ name: 'Attributes' })
  attributes: string;

  @Column({ name: 'AccountId' })
  accountId: string;

  @Column({ name: 'AccessKeyId' })
  accessKeyId: string;

  @Column({ name: 'SecretAccessKeyId' })
  secretAccessKeyId: string;

  @Column({ name: 'Credentials', default: false })
  credentials: boolean;

  @Column({ name: 'Company' })
  company: string;

  @Column({ name: 'IAMUserId' })
  iAMUserId: string;

  @Column({ name: 'CreatedBy' })
  createdBy: number;

  @Column({ name: 'IsActive', default: 1 })
  isActive: number;

  @Column({ name: 'AWSLimit', default: 0 })
  aWSLimit: number;

  @Column({ name: 'BucketName' })
  bucketName: string;

  @Column({ name: 'BucketPrefix' })
  bucketPrefix: string;

  @Column({ name: 'BucketRegion' })
  bucketRegion: string;

  @Column({ name: 'UpdatedBy' })
  UpdatedBy: number;

  @Column({ name: 'IpAddress' })
  ipAddress: string;

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

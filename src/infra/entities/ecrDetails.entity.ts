import {
  BeforeInsert,
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({ name: 'ECRDetails' })
export class ECREntity {
  @PrimaryGeneratedColumn({ name: 'Id' })
  id: number;

  @Column({ name: 'AccountId' })
  accountId: string;

  @Column({ name: 'RepositoryName' })
  repositoryName: string;

  @Column({ name: 'RepositoryArn' })
  repositoryArn: string;

  @Column({ name: 'ImagesCount' })
  imagesCount: number;

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

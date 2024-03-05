import {
  BeforeInsert,
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({ name: 'ElastiCacheDetails' })
export class ElastiCacheEntity {
  @PrimaryGeneratedColumn({ name: 'Id' })
  id: number;

  @Column({ name: 'AccountId' })
  accountId: string;

  @Column({ name: 'CacheClusterId' })
  cacheClusterId: string;

  @Column({ name: 'EngineVersion' })
  engineVersion: string;

  @Column({ name: 'CacheNodeType' })
  cacheNodeType: string;

  @Column({ name: 'SecurityGroups' })
  securityGroups: string;

  @Column({ name: 'CacheSubnetGroupName' })
  cacheSubnetGroupName: string;

  @Column({ name: 'CacheClusterStatus' })
  cacheClusterStatus: string;

  @Column({ name: 'Engine' })
  engine: string;

  @Column({ name: 'CurrencyCode' })
  currencyCode: string;

  @Column({ name: 'CacheHits' })
  cacheHits: number;

  @Column({ name: 'CreatedOn' })
  createdOn: Date;

  @Column({ name: 'LastUpdated' })
  lastUpdated: Date;

  @Column({ name: 'Region' })
  region: string;

  @Column({ name: 'CacheArn' })
  cacheArn: string;

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

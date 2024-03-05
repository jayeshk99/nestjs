import {
  BeforeInsert,
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({ name: 'AwsTaggingDetails' })
export class AwsTaggingDetailEntity {
  @PrimaryGeneratedColumn({ name: 'Id' })
  id: number;

  @Column({ name: 'AccountId' })
  accountId: string;

  @Column({ name: 'ResourceName' })
  resourceName: string;

  @Column({ name: 'ResourceType' })
  resourceType: string;

  @Column({ name: 'ResourceIdentifierValue' })
  resourceIdentifierValue: string;

  @Column({ name: 'Region' })
  region: string;

  @Column({ name: 'Key' })
  key: string;

  @Column({ name: 'Value' })
  value: string;

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

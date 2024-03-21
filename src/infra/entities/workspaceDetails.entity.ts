import {
  BeforeInsert,
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({ name: 'AWSWorkspaceDetails' })
export class AWSWorkspaceEntity {
  @PrimaryGeneratedColumn({ name: 'Id' })
  id: number;

  @Column({ name: 'AccountId' })
  accountId: string;

  @Column({ name: 'WorkspaceId' })
  workspaceId: string;

  @Column({ name: 'WorkspaceArn' })
  workspaceArn: string;

  @Column({ name: 'ComputerName' })
  computerName: string;

  @Column({ name: 'IpAddress' })
  ipAddress: string;

  @Column({ name: 'WorkspaceState' })
  workspaceState: string;

  @Column({ name: 'UserName' })
  userName: string;

  @Column({ name: 'UserLastActive' })
  userLastActive: Date;

  @Column({ name: 'Region' })
  region: string;

  @Column({ name: 'CurrencyCode' })
  currencyCode: string;

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

  @Column({ name: 'UserIpAddress' })
  userIpAddress: string;

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

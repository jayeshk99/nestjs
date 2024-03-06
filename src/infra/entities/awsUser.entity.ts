import {
  BeforeInsert,
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({ name: 'AWSUsers' })
export class AWSUsersEntity {
  @PrimaryGeneratedColumn({ name: '' })
  id: number;

  @Column({ name: 'AccountId' })
  accountId: string;

  @Column({ name: 'IAMUserId' })
  iAMUserId: string;

  @Column({ name: 'IAMUserName' })
  iAMUserName: string;

  @Column({ name: 'UpdatedBy' })
  updatedBy: number;

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

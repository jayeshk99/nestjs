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
  @PrimaryGeneratedColumn()
  Id: number;

  @Column()
  AccountId: string;

  @Column()
  IAMUserId: string;

  @Column()
  IAMUserName: string;

  @Column()
  UpdatedBy: number;

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

import {
  BeforeInsert,
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({ name: 'aws_idle_analysis' })
export class AwsIdleAnalysisEntity {
  @PrimaryGeneratedColumn({ name: 'id' })
  id: number;

  @Column({ name: 'instance_id' })
  instanceId: string;

  @Column({ name: 'account_id' })
  accountId: string;

  @Column({ name: 'threshold' })
  threshold: number;

  @Column({ name: 'upper_duration' })
  upperDuration: number;

  @Column({ name: 'upper_network_in' })
  upperNetworkIn: number;

  @Column({ name: 'upper_network_out' })
  upperNetworkOut: number;

  @Column({ name: 'created_on', type: 'date' })
  createdOn: Date;

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

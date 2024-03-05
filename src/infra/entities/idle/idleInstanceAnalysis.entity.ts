import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
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

  @CreateDateColumn({ name: 'created_on', type: 'date' })
  createdOn: Date;
}

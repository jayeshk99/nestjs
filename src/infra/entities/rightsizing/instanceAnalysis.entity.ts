import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'InstanceAnalysis' })
export class InstanceAnalysisEntity {
  @PrimaryGeneratedColumn({ name: 'Id' })
  id: number;

  @Column({ name: 'InstanceId' })
  instanceId: string;

  @Column({ name: 'UpperThreshold' })
  upperThreshold: number;

  @Column({ name: 'Duration' })
  duration: number;

  @Column({ name: 'Type' })
  type: number;

  @Column({ name: 'Flag', nullable: true })
  flag: number | null;

  @Column({ name: 'CreatedOn', nullable: true })
  createdOn: Date | null;

  @Column({ name: 'AccountId' })
  accountId: string;
}

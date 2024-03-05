import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'AWSPreviousGenerationInstance' })
export class AWSPreviousGenerationInstanceEntity {
  @PrimaryGeneratedColumn({ name: 'Id' })
  id: number;

  @Column({ name: 'InstanceId' })
  instanceId: string;

  @Column({ name: 'Instance' })
  instance: string;

  @Column({ name: 'CurrentHourlyCost' })
  currentHourlyCost: number;

  @Column({ name: 'ProjectedHourlyCost' })
  projectedHourlyCost: number;

  @Column({ name: 'PossibleHourlySavings' })
  possibleHourlySavings: number;

  @Column({ name: 'InstanceType' })
  instanceType: string;

  @Column({ name: 'Recommended' })
  recommended: string;

  @Column({ name: 'Status' })
  status: string;

  @Column({ name: 'AccountId' })
  accountId: string;

  @Column({ name: 'CurrencyCode' })
  currencyCode: string;

  @Column({ name: 'Platform' })
  platform: string;
}

import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'AWSReservedResources' })
export class AWSReservedResourcesEntity {
  @PrimaryGeneratedColumn({ name: 'Id' })
  id: number;

  @Column({ name: 'AccountId' })
  accountId: string;

  @Column({ name: 'InstanceName' })
  instanceName: string;

  @Column({ name: 'InstanceId' })
  instanceId: string;

  @Column({ name: 'InstanceType' })
  instanceType: string;

  @Column({ name: 'OfferingClass' })
  offeringClass: string;

  @Column({ name: 'CurrencySymbol' })
  currencySymbol: string;

  @Column({ name: 'YearlyMonthlySavings' })
  yearlyMonthlySavings: number;

  @Column({ name: 'TriennialMonthlySavings' })
  triennialMonthlySavings: number;

  @Column({ name: 'YearlySavings' })
  yearlySavings: number;

  @Column({ name: 'TriennialSavings' })
  triennialSavings: number;

  @Column({ name: 'Region' })
  region: string;

  @Column({ name: 'IsActive' })
  isActive: number;

  @Column({ name: 'Platform' })
  platform: string;
}

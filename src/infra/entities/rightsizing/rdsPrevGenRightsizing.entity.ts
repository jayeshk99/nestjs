import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'RDSPrevGenRightSizing' })
export class RDSPrevGenRightSizingEntity {
  @PrimaryGeneratedColumn({ name: 'Id' })
  id: number;

  @Column({ name: 'AccountId' })
  accountId: string;

  @Column({ name: 'DBInstanceIdentifier' })
  dbInstanceIdentifier: string;

  @Column({ name: 'DBInstanceClass' })
  dbInstanceClass: string;

  @Column({ name: 'Engine' })
  engine: string;

  @Column({ name: 'RecommendedDBInstanceClass' })
  recommendedDBInstanceClass: string;

  @Column({ name: 'CurrentDBClassMonthlyCost' })
  currentDBClassMonthlyCost: number;

  @Column({ name: 'RecommendedDBClassMonthlyCost' })
  recommendedDBClassMonthlyCost: number;

  @Column({ name: 'PosibleSavings' })
  possibleSavings: number;

  @Column({ name: 'AvailabilityZone' })
  availabilityZone: string;

  @Column({ name: 'Average' })
  average: number;

  @Column({ name: 'Minimum' })
  minimum: number;

  @Column({ name: 'Maximum' })
  maximum: number;

  @Column({ name: 'Unit' })
  unit: string;

  @Column({ name: 'Status' })
  status: string;

  @Column({ name: 'IsDisabled', default: 0 })
  isDisabled: number;

  @Column({ name: 'CurrencyCode' })
  currencyCode: string;

  @Column({ name: 'DBInstanceId' })
  dbInstanceId: string;

  @Column({ name: 'Type' })
  type: number;
}

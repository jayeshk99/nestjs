import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'AWSRightsizingThreshold' })
export class AWSRightsizingThresholdEntity {
  @PrimaryGeneratedColumn({ name: 'Id' })
  id: number;

  @Column({ name: 'AccountId' })
  accountId: string;

  @Column({ name: 'UpscaleThreshold' })
  upscaleThreshold: number;

  @Column({ name: 'UpscaleDays' })
  upscaleDays: number;

  @Column({ name: 'DownscaleThreshold' })
  downscaleThreshold: number;

  @Column({ name: 'DownscaleDays' })
  downscaleDays: number;
}

import {
  BeforeInsert,
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

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

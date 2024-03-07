import { Module } from '@nestjs/common';
import { AwsInstanceRepository } from './instanceDetails.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AwsInstanceEntity } from '../entities/instanceDetails.entity';
import { DatabaseModule } from '../database/database.module';
import { EntitiesModule } from '../entities/entities.module';
import { AWSAccountsEntity } from '../entities/awsAccount.entity';
import { AwsAccountRepository } from './AwsAccount.repository';
import { AwsUsageDetailsRepository } from './awsUsageDetails.repository';
import { S3DetailsRepository } from './s3DetailsRepository';
import { AWSUsageDetailsEntity } from '../entities/awsUsageDetails.entity';
import { S3BucketEntity } from '../entities/s3Details.entity';
import { FsxDetailsRepository } from './fsxDetailsRepository';
import { FSxEntity } from '../entities/fsxDetails.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      AwsInstanceEntity,
      AWSAccountsEntity,
      AWSUsageDetailsEntity,
      S3BucketEntity,
      FSxEntity
    ]),
  ],
  providers: [
    AwsInstanceRepository,
    AwsAccountRepository,
    AwsUsageDetailsRepository,
    S3DetailsRepository,
    FsxDetailsRepository
  ],
  exports: [
    AwsInstanceRepository,
    AwsAccountRepository,
    AwsUsageDetailsRepository,
    S3DetailsRepository,
    FsxDetailsRepository
  ],
})
export class RepositoriesModule {}

// TODO: Implement base repository and extend repos from it

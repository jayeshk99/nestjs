import { Module } from '@nestjs/common';
import { AwsInstanceRepository } from './instanceDetails.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AwsInstanceEntity } from '../entities/instanceDetails.entity';
import { AWSAccountsEntity } from '../entities/awsAccount.entity';
import { AwsAccountRepository } from './AwsAccount.repository';
import { AwsUsageDetailsRepository } from './awsUsageDetails.repository';
import { S3DetailsRepository } from './s3Details.repository';
import { AWSUsageDetailsEntity } from '../entities/awsUsageDetails.entity';
import { S3BucketEntity } from '../entities/s3Details.entity';
import { EFSRepository } from './efs.repository';
import { EFSEntity } from '../entities/efsDetails.entity';
import { S3GlacierDetailsEntity } from '../entities/s3GlacierDetails.entity';
import { S3GlacierRepository } from './s3Glacier.repository';
import { FsxDetailsRepository } from './fsxDetailsRepository';
import { FSxEntity } from '../entities/fsxDetails.entity';
import { RdsDetailsRepository } from './rdsDetails.repositories';
import { RDSDetailsEntity } from '../entities/rdsDetails.entity';
import { ECREntity } from '../entities/ecrDetails.entity';
import { EKSEntity } from '../entities/eksDetails.entity';
import { ECRRepository } from './ecr.repository';
import { EKSRepository } from './eks.repository';
import { RDSCPUUtilizationEntity } from '../entities/rightsizing/rdsCpuUtilization.entity';
import { RdsUtilizationRepository } from './rdsUtilizationRepository';
import { AWSLoadBalancerEntity } from '../entities/awsLoadBalancerDetails.entity';
import { AWSLoadBalancerRepository } from './loadBalancer.repository';
import { BaseRepository } from './base.repository';
import { ResourceGroupRepository } from './resourceGroup.repository';
import { AwsResourceGroupEntity } from '../entities/awsResourceGroupDetails.entity';
import { EBSRepository } from './ebs.repository';
import { EBSEntity } from '../entities/ebsDetails.entity';
import { AwsContainerInstanceEntity } from '../entities/awsContainerInstance.entity';
import { ECSRepository } from './ecs.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      AwsInstanceEntity,
      AWSAccountsEntity,
      AWSUsageDetailsEntity,
      S3BucketEntity,
      EFSEntity,
      S3GlacierDetailsEntity,
      FSxEntity,
      ECREntity,
      EKSEntity,
      FSxEntity,
      RDSDetailsEntity,
      RDSCPUUtilizationEntity,
      AWSLoadBalancerEntity,
      RDSCPUUtilizationEntity,
      AwsResourceGroupEntity,
      EBSEntity,
      AwsContainerInstanceEntity,
    ]),
  ],
  providers: [
    AwsInstanceRepository,
    AwsAccountRepository,
    AwsUsageDetailsRepository,
    S3DetailsRepository,
    EFSRepository,
    S3GlacierRepository,
    FsxDetailsRepository,
    ECRRepository,
    EKSRepository,
    FsxDetailsRepository,
    RdsDetailsRepository,
    RdsUtilizationRepository,
    AWSLoadBalancerRepository,
    RdsUtilizationRepository,
    ResourceGroupRepository,
    EBSRepository,
    ECSRepository,
  ],
  exports: [
    AwsInstanceRepository,
    AwsAccountRepository,
    AwsUsageDetailsRepository,
    S3DetailsRepository,
    FsxDetailsRepository,
    EFSRepository,
    S3GlacierRepository,
    ECRRepository,
    EKSRepository,
    RdsDetailsRepository,
    RdsUtilizationRepository,
    AWSLoadBalancerRepository,
    RdsUtilizationRepository,
    ResourceGroupRepository,
    EBSRepository,
    ECSRepository,
  ],
})
export class RepositoriesModule {}

// TODO: Implement base repository and extend repos from it

import { Injectable, Logger } from '@nestjs/common';
import { AwsAccountRepository } from 'src/infra/repositories/AwsAccount.repository';
import { ClientConfigurationService } from 'src/libs/aws-sdk/clientConfiguration.service';
import { ClientCredentials } from '../../common/interfaces/awsClient.interface';
import { REGIONS } from 'src/common/constants/constants';
import { EC2SdkService } from 'src/libs/aws-sdk/ec2Sdk.service';

import { EFSService } from '../awsResources/efs/efs.service';
import { S3GlacierService } from '../awsResources/s3Glacier/s3Glacier.service';
import { S3Service } from '../awsResources/s3/s3.service';
import { FSxService } from '../awsResources/fsx/fsx.service';
import { Region } from 'src/common/interfaces/ec2Region.interface';
import { ECRService } from '../awsResources/ecr/ecr.service';
import { EKSService } from '../awsResources/eks/eks.service';
import { RdsService } from '../awsResources/rds/rds.service';
import { AWSLoadBalancerService } from '../awsResources/loadBalancer/loadBalancer.service';
import { ResourceGroupService } from '../awsResources/resourceGroups/resourceGroups.service';
import { AwsUsageDetailsRepository } from 'src/infra/repositories/awsUsageDetails.repository';
import { ECSService } from '../awsResources/ecs/ecs.service';
import { EMRService } from '../awsResources/emr/emr.service';
import { EC2Service } from '../awsResources/ec2/ec2.service';
import { ElasticBeanStalkService } from '../awsResources/beanstalk/beanstalk.service';
import { SNSService } from '../awsResources/sns/sns.service';
import { SQSService } from '../awsResources/sqs/sqs.service';
import { ElastiCacheService } from '../awsResources/elasticache/elasticache.service';

@Injectable()
export class ResourceSyncService {
  private readonly logger = new Logger(ResourceSyncService.name);
  constructor(
    private readonly clientConfigurationService: ClientConfigurationService,
    private readonly awsAccountRepository: AwsAccountRepository,
    private readonly ec2SdkService: EC2SdkService,
    private readonly s3Service: S3Service,
    private readonly efsService: EFSService,
    private readonly s3GlacierService: S3GlacierService,
    private readonly fsxService: FSxService,
    private readonly ecrSevice: ECRService,
    private readonly eksService: EKSService,
    private readonly rdsService: RdsService,
    private readonly loadBalancerService: AWSLoadBalancerService,
    private readonly resourceGroupService: ResourceGroupService,
    private readonly awsUsageDetailRepository: AwsUsageDetailsRepository,
    private readonly ecsService: ECSService,
    private readonly ec2Service: EC2Service,
    private readonly beanStalkService: ElasticBeanStalkService,
    private readonly sqsService: SQSService,
    private readonly snsService: SNSService,
    private readonly emrService: EMRService,
    private readonly elastiCacheService:ElastiCacheService
  ) {}

  async syncAllResources(
    AccountId: string,
    startTime: Date,
    endTime: Date,
  ): Promise<void> {
    try {
      const accountDetails =
        await this.awsAccountRepository.getAccountDetails(AccountId);
      const currencyCode =
        await this.awsUsageDetailRepository.getAwsCurrencyCode(
          accountDetails.accountId,
        );
      let clientRequest: ClientCredentials = {
        accessKeyId: accountDetails.accessKeyId,
        secretAccessKey: accountDetails.secretAccessKeyId,
        accountId: AccountId,
        region: REGIONS.US_EAST_1,
        currencyCode: (currencyCode && currencyCode.billing_currency) || '',
      };
      let ec2Client =
        await this.clientConfigurationService.getEC2Client(clientRequest);
      const regions = await this.ec2SdkService.getEnabledRegions(ec2Client);

      await this.s3Service.syncS3Buckets(clientRequest, startTime, endTime);
      await Promise.all(
        regions.Regions.map(async (region) => {
          clientRequest = { ...clientRequest, region: region.RegionName };

          this.efsService.syncEFSFileSystem(clientRequest);
          this.fsxService.syncFSxFileSystem(clientRequest);
          this.s3GlacierService.syncS3GlacierVaults(clientRequest);
          this.rdsService.syncRDSDBInstances(clientRequest);
          this.ecrSevice.syncECRContainers(clientRequest);
          this.eksService.syncEKSClusters(clientRequest);
          this.loadBalancerService.syncAWSLoadBalancers(clientRequest);
          this.resourceGroupService.syncResourceGroups(clientRequest);
          this.ec2Service.syncIpAddresses(clientRequest);
          this.ec2Service.syncEBSVolumes(clientRequest);
          this.ecsService.syncECSClusters(clientRequest);
          this.beanStalkService.syncBeanStalkApplications(clientRequest);
          this.sqsService.syncQueues(clientRequest);
          this.snsService.syncTopics(clientRequest);
          this.emrService.syncEMRClusters(clientRequest)
          this.elastiCacheService.syncCacheClusters(clientRequest)
        }),
      );
    } catch (error) {
      this.logger.log(
        `Error in getting information about account : ${AccountId} message: ${error}`,
      );
    }
  }
}

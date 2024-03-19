import { Injectable, Logger } from '@nestjs/common';
import { AwsAccountRepository } from 'src/infra/repositories/AwsAccount.repository';
import { ClientConfigurationService } from 'src/libs/aws-sdk/clientConfiguration.service';
import { ClientCredentials } from '../../common/interfaces/awsClient.interface';
import { REGIONS } from 'src/common/constants/constants';
import { EC2SdkService } from 'src/libs/aws-sdk/ec2Sdk.service';

import { EFSService } from '../awsResources/efs/efs.service';
import { S3GlacierService } from '../awsResources/s3Glacier/s3Glacier.service';
import { S3Service } from '../awsResources/s3/s3.service';
import { FsxService } from '../awsResources/fsx/fsx.service';
import { Region } from 'src/common/interfaces/ec2Region.interface';
import { ECRService } from '../awsResources/ecr/ecr.service';
import { EKSService } from '../awsResources/eks/eks.service';
import { RdsService } from '../awsResources/rds/rds.service';
import { AWSLoadBalancerService } from '../awsResources/loadBalancer/loadBalancer.service';
import { ResourceGroupService } from '../awsResources/resourceGroups/resourceGroups.service';
import { EBSService } from '../awsResources/ebs/ebs.service';
import { AwsUsageDetailsRepository } from 'src/infra/repositories/awsUsageDetails.repository';
import { ECSService } from '../awsResources/ecs/ecs.service';

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
    private readonly fsxService: FsxService,
    private readonly ecrSevice: ECRService,
    private readonly eksService: EKSService,
    private readonly rdsService: RdsService,
    private readonly loadBalancerService: AWSLoadBalancerService,
    private readonly resourceGroupService: ResourceGroupService,
    private readonly ebsService: EBSService,
    private readonly awsUsageDetailRepository: AwsUsageDetailsRepository,
    private readonly ecsService: ECSService,
  ) {}

  async fetchAllResources(AccountId: string): Promise<void> {
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

      // await this.s3Service.fetchS3Details(clientRequest);
      await Promise.all(
        regions.Regions.map(async (region) => {
          let regionWiseClientRequest = {
            ...clientRequest,
            region: region.RegionName,
          };

          // await this.efsService.fetchEfsDetails(regionWiseClientRequest);
          // await this.s3GlacierService.fetchS3GlacierDetails(
          //   regionWiseClientRequest,
          // );
          // await this.fsxService.fetchFsxDetails(regionWiseClientRequest);
          // await this.ecrSevice.fetchEcrDetails(regionWiseClientRequest);
          // await this.eksService.fetchEksDetails(regionWiseClientRequest);
          // await this.rdsService.fetchRdsDetails(regionWiseClientRequest);
          // await this.loadBalancerService.fetchAWSLoadBalancerDetails(
          //   regionWiseClientRequest,
          // );
          // await this.resourceGroupService.fetchResourceGroupDetails(
          //   regionWiseClientRequest,
          // );
          // await this.ebsService.fetchEBSDetails(regionWiseClientRequest);
          await this.ecsService.fetchEcsDetails(regionWiseClientRequest);
        }),
      );
    } catch (error) {
      this.logger.log(
        `Error in getting information about account : ${AccountId} message: ${error}`,
      );
    }
  }
}

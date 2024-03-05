import { Injectable, Logger } from '@nestjs/common';
import { AwsAccountRepository } from 'src/infra/repositories/AwsAccount.repository';
import { ClientConfigurationService } from 'src/libs/aws-sdk/clientConfiguration.service';
import { ClientCredentials } from '../../common/interfaces/awsClient.interface';
import { REGIONS } from 'src/common/constants/constants';
import { EC2SdkService } from 'src/libs/aws-sdk/ec2Sdk.service';
import { S3Servie } from '../awsResources/s3/s3.service';

@Injectable()
export class ResourceSyncService {
  private readonly logger = new Logger(ResourceSyncService.name);
  constructor(
    private readonly clientConfigurationService: ClientConfigurationService,
    private readonly awsAccountRepository: AwsAccountRepository,
    private readonly ec2SdkService: EC2SdkService,
    private readonly s3Service: S3Servie,
  ) {}

  async fetchAllResources(AccountId: string) {
    try {
      const accountDetails =
        await this.awsAccountRepository.getAccountDetails(AccountId);
      let clientRequest: ClientCredentials = {
        accessKeyId: accountDetails.AccessKeyId,
        secretAccessKeyId: accountDetails.SecretAccessKeyId,
        accountId: AccountId,
        region: REGIONS.US_EAST_1,
      };
      let ec2Client =
        await this.clientConfigurationService.getEC2Client(clientRequest);
      const regions = await this.ec2SdkService.getEnabledRegions(ec2Client);

      // await Promise.all(
      //   regions.Regions.map(async (region) => {
      clientRequest = { ...clientRequest, region: REGIONS.US_EAST_1 };
      await this.s3Service.fetchS3Details(clientRequest);
      //   }),
      // );
    } catch (error) {
      this.logger.log(
        `Error in getting information about account : ${AccountId} message: ${error}`,
      );
    }
  }
}

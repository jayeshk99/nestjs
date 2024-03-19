import { Injectable } from '@nestjs/common';
import { ClientCredentials } from 'src/common/interfaces/awsClient.interface';
import { EBSVolumeProps } from 'src/common/interfaces/ebs.interface';
import { AwsUsageDetailsRepository } from 'src/infra/repositories/awsUsageDetails.repository';
import { ClientConfigurationService } from 'src/libs/aws-sdk/clientConfiguration.service';
import { EC2SdkService } from 'src/libs/aws-sdk/ec2Sdk.service';
import { AwsHelperService } from '../helper/helper.service';
import * as moment from 'moment';
import { EBSRepository } from 'src/infra/repositories/ebs.repository';

@Injectable()
export class EBSService {
  constructor(
    private readonly clientConfigurationService: ClientConfigurationService,
    private readonly ec2SdkService: EC2SdkService,
    private readonly awsUsageDetailsRepository: AwsUsageDetailsRepository,
    private readonly awsHelperService: AwsHelperService,
    private readonly ebsDetailsRepository: EBSRepository,
  ) {}

  async fetchEBSDetails(data: ClientCredentials): Promise<void> {
    const { accessKeyId, secretAccessKey, accountId, region, currencyCode } =
      data;
    const ebsClient = await this.clientConfigurationService.getEC2Client(data);
    const ebsList = await this.ec2SdkService.listEBSVolumes(ebsClient);
    if (ebsList && ebsList.length) {
      for (let i = 0; i < ebsList?.length; i++) {
        const ebsDetails = ebsList[i];
        const attachments =
          ebsDetails.Attachments?.length && ebsDetails.Attachments[0];
        const { dailyCost, isPrevMonthCostAvailable, prevMonthCost } =
          await this.awsHelperService.getCostDetails({
            resourceId: ebsDetails.VolumeId,
            accountId: accountId,
            productCode: 'AmazonEC2',
          });

        const ebsFields: EBSVolumeProps = {
          volumeId: ebsDetails.VolumeId,
          ec2InstanceId: attachments?.InstanceId || null,
          encrypted: ebsDetails.Encrypted,
          size: ebsDetails.Size,
          state: ebsDetails.State,
          volumeType: ebsDetails.VolumeType,
          snapshotId: ebsDetails.SnapshotId,
          vmState: attachments?.State,
          deleteOnTermination: attachments?.DeleteOnTermination,
          createdOn: ebsDetails.CreateTime,
          region: region,
          accountId: accountId,
          unit: 'GB',
          currencyCode: currencyCode,
          monthlyCost: isPrevMonthCostAvailable
            ? prevMonthCost
            : dailyCost * moment().daysInMonth() || 0,
        };

        const doesVolumeExist =
          await this.ebsDetailsRepository.findVolume(ebsFields);
        if (doesVolumeExist) {
          await this.ebsDetailsRepository.updateEBSVolume(
            doesVolumeExist.id,
            ebsFields,
          );
        } else {
          await this.ebsDetailsRepository.addEBSVolume(ebsFields);
        }
      }
    }
  }
}

import { Injectable, Logger } from '@nestjs/common';
import { ClientCredentials } from 'src/common/interfaces/awsClient.interface';
import { ElasticIpProps } from 'src/common/interfaces/elasticIp.interface';
import { ElasticIpRepository } from 'src/infra/repositories/elasticIp.Repository';
import { ClientConfigurationService } from 'src/libs/aws-sdk/clientConfiguration.service';
import { EC2SdkService } from 'src/libs/aws-sdk/ec2Sdk.service';
import { AwsHelperService } from '../helper/helper.service';
import { EBSVolumeProps } from 'src/common/interfaces/ebs.interface';
import * as moment from 'moment';
import { PRODUCT_CODE } from 'src/common/constants/constants';
import { EBSRepository } from 'src/infra/repositories/ebs.repository';

@Injectable()
export class EC2Service {
  private readonly logger = new Logger(EC2Service.name);
  constructor(
    private readonly clientConfigurationService: ClientConfigurationService,
    private readonly ec2SdkService: EC2SdkService,
    private readonly elasticIpRepository: ElasticIpRepository,
    private readonly awsHelperService: AwsHelperService,
    private readonly ebsDetailsRepository: EBSRepository,
  ) {}
  async syncIpAddresses(data: ClientCredentials): Promise<void> {
    try {
      this.logger.log(
        `started Syncing Ip addresses for account:${data.accountId} region:${data.region}`,
      );
      const { accessKeyId, secretAccessKey, accountId, region, currencyCode } =
        data;
      const elasticIpClient =
        await this.clientConfigurationService.getEC2Client(data);
      const elasticIpAddresses =
        await this.ec2SdkService.listIpAddresses(elasticIpClient);

      if (elasticIpAddresses && elasticIpAddresses.length) {
        for (let i = 0; i < elasticIpAddresses.length; i++) {
          const address = elasticIpAddresses[i];
          const ipAddress: ElasticIpProps = {
            elasticIPName:
              address.Tags?.find(({ Key }) => Key === 'Name')?.Value || null,
            location: address.NetworkBorderGroup,
            ipAddress: address.PublicIp,
            instanceId: address?.InstanceId,
            networkInterfaceId: address?.NetworkInterfaceId,
            associationId: address?.AssociationId,
            publicIpv4Pool: address?.PublicIpv4Pool,
            accountId: accountId,
            allocationId: address?.AllocationId,
            currencyCode: currencyCode,
            isActive: 1,
          };
          const doesIpExist = await this.elasticIpRepository.findByCondition({
            where: {
              accountId,
              ipAddress: address.PublicIp,
              isActive: 1,
              location: address.NetworkBorderGroup,
            },
          });
          if (doesIpExist) {
            await this.elasticIpRepository.update(doesIpExist.id, ipAddress);
          } else {
            const ip = this.elasticIpRepository.create(ipAddress);
            await this.elasticIpRepository.save(ip);
          }
        }
      }
      this.logger.log(
        `started Syncing Ip addresses for account:${data.accountId} region:${data.region}`,
      );
    } catch (error) {
      this.logger.log(
        `Error in syncing Ip addresses for account: ${data.accountId} region: ${data.region}: Error: ${error}`,
      );
    }
  }
  async syncEBSVolumes(data: ClientCredentials): Promise<void> {
    try {
      this.logger.log(
        `started Syncing EBS Volumes for account:${data.accountId} region:${data.region}`,
      );
      const { accessKeyId, secretAccessKey, accountId, region, currencyCode } =
        data;
      const ebsClient =
        await this.clientConfigurationService.getEC2Client(data);
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
              productCode: PRODUCT_CODE.EC2,
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
            await this.ebsDetailsRepository.findByCondition({
              where: {
                volumeId: ebsDetails.VolumeId,
                accountId,
                region,
                isActive: 1,
              },
            });
          if (doesVolumeExist) {
            await this.ebsDetailsRepository.update(
              doesVolumeExist.id,
              ebsFields,
            );
          } else {
            const ebs = this.ebsDetailsRepository.create(ebsFields);
            await this.ebsDetailsRepository.save(ebs);
          }
        }
      }
      this.logger.log(
        `completed Syncing EBS Volumes for account:${data.accountId} region:${data.region}`,
      );
    } catch (error) {
      this.logger.log(
        `Error in syncing EBS Volumes for account: ${data.accountId} region: ${data.region}: Error: ${error}`,
      );
    }
  }
}

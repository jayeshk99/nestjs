import { Injectable, Logger } from '@nestjs/common';
import { ClientCredentials } from 'src/common/interfaces/awsClient.interface';
import { ClientConfigurationService } from 'src/libs/aws-sdk/clientConfiguration.service';
import { AwsHelperService } from '../helper/helper.service';
import { PRODUCT_CODE } from 'src/common/constants/constants';
import moment from 'moment';
import { globalAcceleratorSdkService } from 'src/libs/aws-sdk/globalAcceleratorSdk.service';
import { GlobalAcceleratorRepository } from 'src/infra/repositories/globalAccelerator.repository';
import { GlobalAcceleratorEntity } from 'src/infra/entities/globalAccelerator.entity';

@Injectable()
export class GlobalAcceleratorService {
  private readonly logger = new Logger(GlobalAcceleratorService.name);
  constructor(
    private readonly clientConfigurationService: ClientConfigurationService,
    private readonly globalAcceleratorSdkService: globalAcceleratorSdkService,
    private readonly awsHelperService: AwsHelperService,
    private readonly globalAcceleratorRepository: GlobalAcceleratorRepository,
  ) {}
  async fetchAcceleratorDetails(data: ClientCredentials) {
    try {
      this.logger.log(
        `GlobalAccelerator details job STARTED for account: ${data.accountId} region: ${data.region}`,
      );
      const { accessKeyId, secretAccessKey, accountId, region, currencyCode } =
        data;
      const globalAcceleratorClient =
        await this.clientConfigurationService.getGlobalAcceleratorClient(data);

      const accelerators =
        await this.globalAcceleratorSdkService.listAccelerators(
          globalAcceleratorClient,
        );

      if (accelerators && accelerators.length) {
        for (let acc of accelerators) {
          const { dailyCost, isPrevMonthCostAvailable, prevMonthCost } =
            await this.awsHelperService.getCostDetails({
              resourceId: acc.AcceleratorArn,
              accountId: accountId,
              productCode: PRODUCT_CODE.Workspaces,
            });
          const accFields: Partial<GlobalAcceleratorEntity> = {
            name: acc?.Name,
            accountId: accountId,
            arn: acc?.AcceleratorArn,
            dnsName: acc?.DnsName,
            enabled: acc?.Enabled,
            status: acc?.Status,
            ipAddressType: acc?.IpAddressType,
            // Sets: acc?.IpSets
            createdOn: acc?.CreatedTime,
            updatedOn: acc?.LastModifiedTime,
            monthlyCost: isPrevMonthCostAvailable
              ? prevMonthCost
              : dailyCost * moment().daysInMonth() || 0,
            currencyCode: currencyCode,
          };

          const isaccExist =
            await this.globalAcceleratorRepository.findByCondition({
              where: {
                accountId: accFields.accountId,
                arn: accFields.arn,
                isActive: 1,
              },
            });
          if (isaccExist) {
            await this.globalAcceleratorRepository.update(
              isaccExist.id,
              accFields,
            );
          } else {
            const accEntity =
              this.globalAcceleratorRepository.create(accFields);
            await this.globalAcceleratorRepository.save(accEntity);
          }
        }
      }
      this.logger.log(
        `GlobalAccelerator Details job COMPLETED for account: ${data.accountId} region: ${data.region}`,
      );
    } catch (error) {
      this.logger.log(
        `Error in getting GlobalAccelerator Details for account: ${data.accountId} region: ${data.region}: Error: ${error}`,
      );
    }
  }
}

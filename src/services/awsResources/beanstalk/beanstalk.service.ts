import { Injectable, Logger } from '@nestjs/common';
import { ClientCredentials } from 'src/common/interfaces/awsClient.interface';
import { BeanStalkSdkService } from 'src/libs/aws-sdk/beanstalkSdk.service';
import { ClientConfigurationService } from 'src/libs/aws-sdk/clientConfiguration.service';
import { AwsHelperModule } from '../helper/helper.module';
import { AwsHelperService } from '../helper/helper.service';
import { PRODUCT_CODE } from 'src/common/constants/constants';
import * as moment from 'moment';
import { ElasticBeanStalkProps } from 'src/common/interfaces/elasticBeanstalk.interface';
import { BeanStalkRepository } from 'src/infra/repositories/elasticbeanstalk.repository';

@Injectable()
export class ElasticBeanStalkService {
  private readonly logger = new Logger(ElasticBeanStalkService.name);
  constructor(
    private readonly clientConfigurationService: ClientConfigurationService,
    private readonly beanStalkSdkService: BeanStalkSdkService,
    private readonly awsHelperService: AwsHelperService,
    private readonly beanStalkRepository: BeanStalkRepository,
  ) {}
  async syncBeanStalkApplications(data: ClientCredentials) {
    try {
      const { accountId, currencyCode, region } = data;
      this.logger.log(
        `started syncing job for BeanStalk applications for account:${data.accountId} region:${data.region}`,
      );
      const beanstalkClient =
        await this.clientConfigurationService.getBeanStalkClient(data);
      const beanstalkApplications =
        await this.beanStalkSdkService.listApplications(beanstalkClient);
      if (beanstalkApplications && beanstalkApplications.length) {
        for (let i = 0; i < beanstalkApplications.length; i++) {
          const beanstalk = beanstalkApplications[i];
          const { dailyCost, isPrevMonthCostAvailable, prevMonthCost } =
            await this.awsHelperService.getCostDetails({
              resourceId: beanstalk.ApplicationArn,
              accountId: accountId,
              productCode: PRODUCT_CODE['Elastic BeanStalk'],
            });

          const beanstalkFields: ElasticBeanStalkProps = {
            appArn: beanstalk.ApplicationArn,
            appName: beanstalk.ApplicationName,
            description: beanstalk.Description,
            createdOn: beanstalk.DateCreated,
            updatedOn: beanstalk.DateUpdated,
            versions: beanstalk?.Versions?.join(', '),
            accountId: accountId,
            region: region,
            monthlyCost: isPrevMonthCostAvailable
              ? prevMonthCost
              : dailyCost * moment().daysInMonth() || 0,
            currencyCode: currencyCode,
          };
          const doesAppExist = await this.beanStalkRepository.findByCondition({
            where: {
              appArn: beanstalk.ApplicationArn,
              accountId,
              region,
              isActive: 1,
            },
          });
          if (doesAppExist) {
            await this.beanStalkRepository.update(
              doesAppExist.id,
              beanstalkFields,
            );
          } else {
            const app = this.beanStalkRepository.create(beanstalkFields);
            await this.beanStalkRepository.save(app);
          }
        }
      }
      this.logger.log(
        `completed syncing job for BeanStalk applications for account:${data.accountId} region:${data.region}`,
      );
    } catch (error) {
      this.logger.log(
        `Error in syncing BeanStalk Applications for account:${data.accountId} region:${data.region} error:${error}`,
      );
    }
  }
}

import { Injectable, Logger } from '@nestjs/common';
import { ClientCredentials } from 'src/common/interfaces/awsClient.interface';
import { ClientConfigurationService } from 'src/libs/aws-sdk/clientConfiguration.service';
import { ElastiCacheSdkService } from 'src/libs/aws-sdk/elaticacheSdk.service';
import { AwsHelperService } from '../helper/helper.service';
import {
  AWS_METRIC_NAMES,
  AWS_NAME_SPACES,
  PRODUCT_CODE,
} from 'src/common/constants/constants';
import { ElastiCacheEntity } from 'src/infra/entities/elasticCacheDetails.entity';
import * as moment from 'moment';
import { ElastiCacheRepository } from 'src/infra/repositories/elasticache.repository';

@Injectable()
export class ElastiCacheService {
  private readonly logger = new Logger(ElastiCacheService.name);
  constructor(
    private readonly clientConfigurationService: ClientConfigurationService,
    private readonly elastiCacheSdkService: ElastiCacheSdkService,
    private readonly awsHelperService: AwsHelperService,
    private readonly elastiCacheRepository: ElastiCacheRepository,
  ) {}
  async syncCacheClusters(
    data: ClientCredentials,
    startTime: Date,
    endDate: Date,
  ) {
    try {
      this.logger.log(
        `started Syncing Cache clusters for account:${data.accountId} region:${data.region}`,
      );
      const { accountId, accessKeyId, secretAccessKey, region, currencyCode } =
        data;
      const cacheClient =
        await this.clientConfigurationService.getElastiCacheClient(data);
      const clusterList =
        await this.elastiCacheSdkService.listCacheClusters(cacheClient);
      if (clusterList.length) {
        const cloudwatchclient =
          await this.clientConfigurationService.getCloudWatchClient(data);
        for (let i = 0; i < clusterList.length; i++) {
          const cache = clusterList[i];
          const metricData = await this.awsHelperService.getMetricsData(
            {
              Namespace: AWS_NAME_SPACES.ElastiCache,
              MetricName: AWS_METRIC_NAMES.CACHE_HITS,
              Dimensions: [
                { Name: 'CacheClusterId', Value: cache.CacheClusterId },
              ],
              StartTime: startTime,
              EndTime: endDate,
              Period: 86400,
            },
            cloudwatchclient,
          );
          const cacheHits = metricData[0]?.Sum;
          const { dailyCost, isPrevMonthCostAvailable, prevMonthCost } =
            await this.awsHelperService.getCostDetails({
              resourceId: cache.ARN,
              accountId: accountId,
              productCode: PRODUCT_CODE['Elastic Cache'],
            });
          const elastiCacheFields: Partial<ElastiCacheEntity> = {
            cacheClusterId: cache.CacheClusterId,
            engineVersion: cache.EngineVersion,
            cacheArn: cache.ARN,
            createdOn: cache.CacheClusterCreateTime,
            cacheNodeType: cache.CacheNodeType,
            cacheHits,
            securityGroups: cache.SecurityGroups?.reduce(
              (acc: string, { SecurityGroupId }) =>
                acc + SecurityGroupId + ', ',
              '',
            ).slice(0, -2),
            cacheSubnetGroupName: cache.CacheSubnetGroupName,
            cacheClusterStatus: cache.CacheClusterStatus,
            engine: cache.Engine,
            region,
            accountId,
            monthlyCost: isPrevMonthCostAvailable
              ? prevMonthCost
              : dailyCost * moment().daysInMonth() || 0,
            currencyCode,
          };
          const doesCacheExists =
            await this.elastiCacheRepository.findByCondition({
              where: { accountId, region, isActive: 1, cacheArn: cache.ARN },
            });
          if (doesCacheExists) {
            await this.elastiCacheRepository.update(doesCacheExists.id, {
              ...elastiCacheFields,
            });
          } else {
            const elasticache =
              this.elastiCacheRepository.create(elastiCacheFields);
            await this.elastiCacheRepository.save(elasticache);
          }
        }
      }
      this.logger.log(
        `started Syncing Cache clusters for account:${data.accountId} region:${data.region}`,
      );
    } catch (error) {
      this.logger.log(
        `Error in syncing cache Details for account: ${data.accountId} region: ${data.region}: Error: ${error}`,
      );
    }
  }
}

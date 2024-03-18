import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AWSUsageDetailsEntity } from '../entities/awsUsageDetails.entity';
import {
  AWSPricingReq,
  awsResourceAvailableprops,
  awsUsageCostProps,
} from 'src/common/interfaces/common.interfaces';
import * as moment from 'moment';

@Injectable()
export class AwsUsageDetailsRepository {
  constructor(
    @InjectRepository(AWSUsageDetailsEntity)
    private readonly awsUsageDetailsRepository: Repository<AWSUsageDetailsEntity>,
  ) {}
  async getOneDayCostOfResource(data: AWSPricingReq) {
    const { awsAccountId, productCode, resourceId } = data;
    let cost: Partial<AWSUsageDetailsEntity>;
    const limitDate = new Date(
      moment().subtract(1, 'day').format('YYYY-MM-DD'),
    );
    if (data.resourceId) {
      cost = await this.awsUsageDetailsRepository
        .createQueryBuilder('costData')
        .select('costData.BillingDate', 'billingDate')
        .addSelect('costData.CurrencyCode', 'currencyCode')
        .addSelect('costData.ProductCode', 'productCode')
        .addSelect('costData.UnBlendedCost', 'unBlendedCost')
        .where('costData.ProductCode = :productCode', { productCode })
        .andWhere('costData.ResourceId like :resourceId', {
          resourceId: `%${resourceId}%`,
        })
        .andWhere('costData.BillingDate < :limitDate', { limitDate })
        .andWhere('costData.UsageAccountId = :awsAccountId', { awsAccountId })
        .orderBy('costData.BillingDate', 'DESC')
        .getRawOne();
    } else {
      cost = await this.awsUsageDetailsRepository
        .createQueryBuilder('costData')
        .select('costData.BillingDate', 'billingDate')
        .addSelect('costData.CurrencyCode', 'currencyCode')
        .addSelect('costData.ProductCode', 'productCode')
        .addSelect('costData.UnBlendedCost', 'unBlendedCost')
        .where('costData.ProductCode = :productCode', { productCode })
        .andWhere('costData.UsageAccountId = :awsAccountId', { awsAccountId })
        .andWhere('costData.BillingDate < :limitDate', { limitDate })
        .orderBy('costData.BillingDate', 'DESC')
        .getRawOne();
    }
    return cost;
  }

  async getAwsCurrencyCode(
    accountId: string,
  ): Promise<{ billing_currency: string }> {
    return await this.awsUsageDetailsRepository
      .createQueryBuilder('data')
      .select('data.CurrencyCode', 'billing_currency')
      .where('data.UsageAccountId = :accountId', { accountId })
      .orderBy('data.BillingDate', 'DESC')
      .limit(1)
      .getRawOne();
  }

  async getAwsStorageUsageCost(params: awsUsageCostProps) {
    const { awsAccountId, startTime, endTime, prouductCode, resourceId } =
      params;
    return await this.awsUsageDetailsRepository
      .createQueryBuilder('cost')
      .select('SUM(cost.UnBlendedCost)', 'costSum')
      .where('cost.ResourceId = :resourceId', { resourceId })
      .andWhere('cost.ProductCode = :prouductCode', { prouductCode })
      .andWhere('cost.UsageAccountId = :awsAccountId', { awsAccountId })
      .andWhere('cost.BillingDate BETWEEN :startTime AND :endTime', {
        startTime: new Date(startTime),
        endTime: new Date(endTime),
      })
      .getRawOne();
  }
  async findPrevMonthCostAvailable(
    params: awsResourceAvailableprops,
  ): Promise<boolean> {
    const { awsAccountId, prouductCode, resourceId, billingDate } = params;
    const res = await this.awsUsageDetailsRepository.findOne({
      where: {
        resourceId: resourceId,
        usageAccountId: awsAccountId,
        billingDate: new Date(billingDate),
        productCode: prouductCode,
      },
    });
    return res ? true : false;
  }
}

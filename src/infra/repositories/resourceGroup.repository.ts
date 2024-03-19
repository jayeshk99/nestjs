import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AwsResourceGroupEntity } from '../entities/awsResourceGroupDetails.entity';
import { Repository } from 'typeorm';
import { ResourceGroupProps } from 'src/common/interfaces/resourceGroup.interface';

@Injectable()
export class ResourceGroupRepository {
  private logger = new Logger(ResourceGroupRepository.name);
  constructor(
    @InjectRepository(AwsResourceGroupEntity)
    private readonly resourceGroupRepository: Repository<AwsResourceGroupEntity>,
  ) {}

  async findResourceGroup(
    data: ResourceGroupProps,
  ): Promise<AwsResourceGroupEntity> {
    const { accountId, resourceGroupArn } = data;
    return await this.resourceGroupRepository.findOne({
      where: { accountId, resourceGroupArn, isActive: 1 },
    });
  }

  async addResourceGroup(data: ResourceGroupProps): Promise<void> {
    try {
      const result = this.resourceGroupRepository.create(data);
      await this.resourceGroupRepository.save(result);
    } catch (error) {
      this.logger.log(
        `error while adding resource group for account:${data.accountId} region:${data.region} error:${error}`,
      );
    }
  }

  async updateResourceGroup(
    id: number,
    data: ResourceGroupProps,
  ): Promise<void> {
    try {
      await this.resourceGroupRepository.update({ id }, { ...data });
    } catch (error) {
      this.logger.log(
        `error while updating resource group for account:${data.accountId} region:${data.region} error:${error}`,
      );
    }
  }
}

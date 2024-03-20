import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AwsResourceGroupEntity } from '../entities/awsResourceGroupDetails.entity';
import { Repository } from 'typeorm';
import { BaseRepository } from './base.repository';

@Injectable()
export class ResourceGroupRepository extends BaseRepository<
  AwsResourceGroupEntity,
  number
> {
  constructor(
    @InjectRepository(AwsResourceGroupEntity)
    private readonly resourceGroupRepository: Repository<AwsResourceGroupEntity>,
  ) {
    super(resourceGroupRepository);
  }
}

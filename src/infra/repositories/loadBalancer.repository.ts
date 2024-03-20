import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { AWSLoadBalancerEntity } from '../entities/awsLoadBalancerDetails.entity';
import { BaseRepository } from './base.repository';

@Injectable()
export class AWSLoadBalancerRepository extends BaseRepository<
  AWSLoadBalancerEntity,
  number
> {
  constructor(
    @InjectRepository(AWSLoadBalancerEntity)
    private readonly loadBalancerRepository: Repository<AWSLoadBalancerEntity>,
  ) {
    super(loadBalancerRepository);
  }
}

import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { EFSEntity } from '../entities/efsDetails.entity';
import { EFSProps } from 'src/common/interfaces/efs.interface';
import { AWSLoadBalancerEntity } from '../entities/awsLoadBalancerDetails.entity';
import { AWSLoadBalancerProps } from 'src/common/interfaces/loadBalancer.interface';
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

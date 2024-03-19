import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { EFSEntity } from '../entities/efsDetails.entity';
import { EFSProps } from 'src/common/interfaces/efs.interface';
import { AWSLoadBalancerEntity } from '../entities/awsLoadBalancerDetails.entity';
import { AWSLoadBalancerProps } from 'src/common/interfaces/loadBalancer.interface';

@Injectable()
export class AWSLoadBalancerRepository {
  constructor(
    @InjectRepository(AWSLoadBalancerEntity)
    private readonly loadBalancerRepository: Repository<AWSLoadBalancerEntity>,
  ) {}

  async findLoadBalancer(params: AWSLoadBalancerProps) {
    const { accountId, loadBalancerName } = params;
    return await this.loadBalancerRepository.findOne({
      where: { accountId, loadBalancerName, isActive: 1 },
    });
  }

  async updateLoadBalancer(id: number, data: AWSLoadBalancerProps) {
    return await this.loadBalancerRepository.update({ id }, { ...data });
  }

  async createLoadBalancer(data: AWSLoadBalancerProps) {
    const result = this.loadBalancerRepository.create(data);
    return this.loadBalancerRepository.save(result);
    // return await this.s3BucketRepository.save({ ...data });
  }
}

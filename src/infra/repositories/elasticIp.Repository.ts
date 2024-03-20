import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { EKSEntity } from '../entities/eksDetails.entity';
import { EKSProps } from 'src/common/interfaces/eks.interface';
import { ElasticIPAddress } from '../entities/elasticIpAddresses.entity';
import { ElasticIpProps } from 'src/common/interfaces/elasticIp.interface';
import { BaseRepository } from './base.repository';

@Injectable()
export class ElasticIpRepository extends BaseRepository<
  ElasticIPAddress,
  number
> {
  constructor(
    @InjectRepository(ElasticIPAddress)
    private readonly elasticIpRepository: Repository<ElasticIPAddress>,
  ) {
    super(elasticIpRepository);
  }
}

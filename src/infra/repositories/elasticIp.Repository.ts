import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { EKSEntity } from '../entities/eksDetails.entity';
import { EKSProps } from 'src/common/interfaces/eks.interface';
import { ElasticIPAddress } from '../entities/elasticIpAddresses.entity';
import { ElasticIpProps } from 'src/common/interfaces/elasticIp.interface';

@Injectable()
export class ElasticIpRepository {
  constructor(
    @InjectRepository(ElasticIPAddress)
    private readonly elasticIpRepository: Repository<ElasticIPAddress>,
  ) {}

  async findIpAddress(params: ElasticIpProps) {
    const { accountId, ipAddress } = params;
    return await this.elasticIpRepository.findOne({
      where: { accountId, ipAddress, isActive: 1 },
    });
  }

  async updateIpAddress(id: number, data: ElasticIpProps) {
    await this.elasticIpRepository.update({ id }, { ...data });
  }

  async addIpAddress(data: ElasticIpProps) {
    const result = this.elasticIpRepository.create(data);
    await this.elasticIpRepository.save(result);
  }
}

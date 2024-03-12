import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { EKSEntity } from '../entities/eksDetails.entity';
import { EKSProps } from 'src/common/interfaces/eks.interface';

@Injectable()
export class EKSRepository {
  constructor(
    @InjectRepository(EKSEntity)
    private readonly eksRepository: Repository<EKSEntity>,
  ) {}

  async findEks(params: EKSProps) {
    const { accountId, clusterArn } = params;
    return await this.eksRepository.findOne({
      where: { accountId, clusterArn, isActive: 1 },
    });
  }

  async updateEks(id: number, data: EKSProps) {
    return await this.eksRepository.update({ id }, { ...data });
  }

  async createEks(data: EKSProps) {
    const result = this.eksRepository.create(data);
    return this.eksRepository.save(result);
    // return await this.s3BucketRepository.save({ ...data });
  }
}

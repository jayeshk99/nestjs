import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { ECREntity } from '../entities/ecrDetails.entity';
import { ECRProps } from 'src/common/interfaces/ecrProps.interface';

@Injectable()
export class ECRRepository {
  constructor(
    @InjectRepository(ECREntity)
    private readonly ecrRepository: Repository<ECREntity>,
  ) {}

  async findEcr(params: ECRProps) {
    const { accountId, repositoryArn } = params;
    return await this.ecrRepository.findOne({
      where: { accountId, repositoryArn, isActive: 1 },
    });
  }

  async updateEcr(id: number, data: ECRProps) {
    return await this.ecrRepository.update({ id }, { ...data });
  }

  async createEcr(data: ECRProps) {
    const result = this.ecrRepository.create(data);
    return this.ecrRepository.save(result);
    // return await this.s3BucketRepository.save({ ...data });
  }
}

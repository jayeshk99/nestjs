import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { S3BucketEntity } from '../entities/s3Details.entity';
import { S3BucketProps } from 'src/common/interfaces/s3.interface';
import { EFSEntity } from '../entities/efsDetails.entity';
import { EFSProps } from 'src/common/interfaces/efs.interface';

@Injectable()
export class EFSRepository {
  constructor(
    @InjectRepository(EFSEntity)
    private readonly efsRepository: Repository<EFSEntity>,
  ) {}

  async findEFS(params: EFSProps) {
    const { accountId, fileSystemId } = params;
    return await this.efsRepository.findOne({
      where: { accountId, fileSystemId, isActive: 1 },
    });
  }

  async updateEfs(id: number, data: S3BucketProps) {
    return await this.efsRepository.update({ id }, { ...data });
  }

  async createEfs(data: S3BucketProps) {
    const result = this.efsRepository.create(data);
    return this.efsRepository.save(result);
    // return await this.s3BucketRepository.save({ ...data });
  }
}

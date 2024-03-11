import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { S3GlacierDetailsEntity } from '../entities/s3GlacierDetails.entity';
import { S3GlacierProps } from 'src/common/interfaces/s3Glacier.interface';

@Injectable()
export class S3GlacierRepository {
  constructor(
    @InjectRepository(S3GlacierDetailsEntity)
    private readonly s3GlacierRepository: Repository<S3GlacierDetailsEntity>,
  ) {}
  async getAll(): Promise<S3GlacierDetailsEntity[]> {
    return await this.s3GlacierRepository.find();
  }

  async findS3Glacier(params: S3GlacierProps) {
    const { accountId, vaultARN } = params;
    return await this.s3GlacierRepository.findOne({
      where: { accountId, vaultARN, isActive: 1 },
    });
  }

  async updateS3Glacier(id: number, data: S3GlacierProps) {
    return await this.s3GlacierRepository.update({ id }, { ...data });
  }

  async createS3Glacier(data: S3GlacierProps) {
    const result = this.s3GlacierRepository.create(data);
    return this.s3GlacierRepository.save(result);
    // return await this.s3GlacierRepository.save({ ...data });
  }
}

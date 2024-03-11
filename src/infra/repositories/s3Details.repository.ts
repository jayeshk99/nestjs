import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { S3BucketEntity } from '../entities/s3Details.entity';
import { S3BucketProps } from 'src/common/interfaces/s3.interface';

@Injectable()
export class S3DetailsRepository {
  constructor(
    @InjectRepository(S3BucketEntity)
    private readonly s3BucketRepository: Repository<S3BucketEntity>,
  ) {}
  async getAll(): Promise<S3BucketEntity[]> {
    return await this.s3BucketRepository.find();
  }

  async findS3Bucket(params: S3BucketProps) {
    const { accountId, storageName } = params;
    return await this.s3BucketRepository.findOne({
      where: { accountId, storageName, isActive: 1 },
    });
  }

  async updateS3Bucket(id: number, data: S3BucketProps) {
    return await this.s3BucketRepository.update({ id }, { ...data });
  }

  async createS3Bucket(data: S3BucketProps) {
    const result = this.s3BucketRepository.create(data);
    return this.s3BucketRepository.save(result);
    // return await this.s3BucketRepository.save({ ...data });
  }
}

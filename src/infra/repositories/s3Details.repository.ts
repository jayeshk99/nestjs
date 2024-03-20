import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { S3BucketEntity } from '../entities/s3Details.entity';
import { S3BucketProps } from 'src/common/interfaces/s3.interface';
import { BaseRepository } from './base.repository';

@Injectable()
export class S3DetailsRepository extends BaseRepository<
  S3BucketEntity,
  number
> {
  constructor(
    @InjectRepository(S3BucketEntity)
    private readonly s3BucketRepository: Repository<S3BucketEntity>,
  ) {
    super(s3BucketRepository);
  }
  
}

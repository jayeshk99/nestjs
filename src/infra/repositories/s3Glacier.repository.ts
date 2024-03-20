import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { S3GlacierDetailsEntity } from '../entities/s3GlacierDetails.entity';
import { S3GlacierProps } from 'src/common/interfaces/s3Glacier.interface';
import { BaseRepository } from './base.repository';

@Injectable()
export class S3GlacierRepository extends BaseRepository<
  S3GlacierDetailsEntity,
  number
> {
  constructor(
    @InjectRepository(S3GlacierDetailsEntity)
    private readonly s3GlacierRepository: Repository<S3GlacierDetailsEntity>,
  ) {
    super(s3GlacierRepository);
  }
}

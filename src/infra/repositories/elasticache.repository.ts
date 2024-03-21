import { Injectable } from '@nestjs/common';
import { BaseRepository } from './base.repository';
import { ElastiCacheEntity } from '../entities/elasticCacheDetails.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class ElastiCacheRepository extends BaseRepository<
  ElastiCacheEntity,
  number
> {
  constructor(
    @InjectRepository(ElastiCacheEntity)
    private readonly elasticacheRepository: Repository<ElastiCacheEntity>,
  ) {
    super(elasticacheRepository);
  }
}

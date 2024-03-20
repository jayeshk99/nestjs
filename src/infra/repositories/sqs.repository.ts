import { Injectable } from '@nestjs/common';
import { BaseRepository } from './base.repository';
import { SQSDetailsEntity } from '../entities/sqsDetails.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class SQSRepository extends BaseRepository<SQSDetailsEntity, number> {
  constructor(
    @InjectRepository(SQSDetailsEntity)
    private readonly sqsRepository: Repository<SQSDetailsEntity>,
  ) {
    super(sqsRepository);
  }
}

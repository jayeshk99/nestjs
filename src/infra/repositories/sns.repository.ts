import { InjectRepository } from '@nestjs/typeorm';
import { BaseRepository } from './base.repository';
import { SNSDetailsEntity } from '../entities/snsDetails.entity';
import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';

@Injectable()
export class SNSRepository extends BaseRepository<SNSDetailsEntity, number> {
  constructor(
    @InjectRepository(SNSDetailsEntity)
    private readonly snsRepository: Repository<SNSDetailsEntity>,
  ) {
    super(snsRepository);
  }
}

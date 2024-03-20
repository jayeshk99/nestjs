import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { BaseRepository } from './base.repository';
import { EMREntity } from '../entities/emrDetails.entity';

@Injectable()
export class EMRRepository extends BaseRepository<EMREntity, number> {
  constructor(
    @InjectRepository(EMREntity)
    private readonly emrRepository: Repository<EMREntity>,
  ) {
    super(emrRepository);
  }
}

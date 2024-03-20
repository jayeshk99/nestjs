import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { ECREntity } from '../entities/ecrDetails.entity';
import { ECRProps } from 'src/common/interfaces/ecrProps.interface';
import { BaseRepository } from './base.repository';

@Injectable()
export class ECRRepository extends BaseRepository<ECREntity, number> {
  constructor(
    @InjectRepository(ECREntity)
    private readonly ecrRepository: Repository<ECREntity>,
  ) {
    super(ecrRepository);
  }
}

import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { EKSEntity } from '../entities/eksDetails.entity';
import { EKSProps } from 'src/common/interfaces/eks.interface';
import { BaseRepository } from './base.repository';

@Injectable()
export class EKSRepository extends BaseRepository<EKSEntity, number> {
  constructor(
    @InjectRepository(EKSEntity)
    private readonly eksRepository: Repository<EKSEntity>,
  ) {
    super(eksRepository);
  }
}

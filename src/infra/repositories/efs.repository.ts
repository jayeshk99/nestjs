import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { EFSEntity } from '../entities/efsDetails.entity';
import { EFSProps } from 'src/common/interfaces/efs.interface';
import { BaseRepository } from './base.repository';

@Injectable()
export class EFSRepository extends BaseRepository<EFSEntity, number> {
  constructor(
    @InjectRepository(EFSEntity)
    private readonly efsRepository: Repository<EFSEntity>,
  ) {
    super(efsRepository);
  }
}

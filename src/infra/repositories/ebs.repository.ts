import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { EBSEntity } from '../entities/ebsDetails.entity';
import { EBSVolumeProps } from 'src/common/interfaces/ebs.interface';
import { BaseRepository } from './base.repository';

@Injectable()
export class EBSRepository extends BaseRepository<EBSEntity, number> {
  constructor(
    @InjectRepository(EBSEntity)
    private readonly ebsRepository: Repository<EBSEntity>,
  ) {
    super(ebsRepository);
  }
}

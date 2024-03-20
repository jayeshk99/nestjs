import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { FsxFileSystemProps } from 'src/common/interfaces/fsx.interface';
import { FSxEntity } from '../entities/fsxDetails.entity';
import { BaseRepository } from './base.repository';

@Injectable()
export class FsxDetailsRepository extends BaseRepository<FSxEntity, number> {
  constructor(
    @InjectRepository(FSxEntity)
    private readonly fsxRepository: Repository<FSxEntity>,
  ) {
    super(fsxRepository);
  }
}

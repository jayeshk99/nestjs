import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { BaseRepository } from './base.repository';
import { GlobalAcceleratorEntity } from '../entities/globalAccelerator.entity';

@Injectable()
export class GlobalAcceleratorRepository extends BaseRepository<
  GlobalAcceleratorEntity,
  number
> {
  constructor(
    @InjectRepository(GlobalAcceleratorEntity)
    private readonly globalAcceleratorRepository: Repository<GlobalAcceleratorEntity>,
  ) {
    super(globalAcceleratorRepository);
  }
}

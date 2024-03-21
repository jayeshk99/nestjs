import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { BaseRepository } from './base.repository';
import { AWSWorkspaceEntity } from '../entities/workspaceDetails.entity';

@Injectable()
export class AWSWorkspaceRepository extends BaseRepository<
  AWSWorkspaceEntity,
  number
> {
  constructor(
    @InjectRepository(AWSWorkspaceEntity)
    private readonly awsWorkspaceRepository: Repository<AWSWorkspaceEntity>,
  ) {
    super(awsWorkspaceRepository);
  }
}

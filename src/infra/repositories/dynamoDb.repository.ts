import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { BaseRepository } from './base.repository';
import { EMREntity } from '../entities/emrDetails.entity';
import { DynamoDBDetailEntity } from '../entities/dynamoDbDetails.entity';

@Injectable()
export class DynamoDBRepository extends BaseRepository<
  DynamoDBDetailEntity,
  number
> {
  constructor(
    @InjectRepository(DynamoDBDetailEntity)
    private readonly dynamoDbRepository: Repository<DynamoDBDetailEntity>,
  ) {
    super(dynamoDbRepository);
  }
}

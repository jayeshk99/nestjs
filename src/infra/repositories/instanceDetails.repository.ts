import { Inject, Injectable } from '@nestjs/common';
import { AwsInstanceEntity } from '../entities/instanceDetails.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class AwsInstanceRepository {
  constructor(
    @InjectRepository(AwsInstanceEntity)
    private readonly awsInstanceRepository: Repository<AwsInstanceEntity>,
  ) {}
  async getAll(): Promise<AwsInstanceEntity[]> {
    return await this.awsInstanceRepository.find();
  }
}

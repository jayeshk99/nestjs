import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { S3BucketEntity } from '../entities/s3Details.entity';
import { S3BucketProps } from 'src/common/interfaces/s3.interface';
import { RDSDetailsEntity } from '../entities/rdsDetails.entity';
import { RDSInstanceProps } from 'src/common/interfaces/rds.interface';

@Injectable()
export class RdsDetailsRepository {
  constructor(
    @InjectRepository(RDSDetailsEntity)
    private readonly dbInstanceRepository: Repository<RDSDetailsEntity>,
  ) {}
  async getAll(): Promise<RDSDetailsEntity[]> {
    return await this.dbInstanceRepository.find();
  }

  async findDBInstance(params: RDSInstanceProps) {
    const { accountId, dbInstanceArn } = params;
    return await this.dbInstanceRepository.findOne({
      where: { accountId, dbInstanceArn, isActive: 1 },
    });
  }

  async updateDBInstance(id: number, data: RDSInstanceProps) {
    return await this.dbInstanceRepository.update({ id }, { ...data });
  }

  async createDBInstance(data: RDSInstanceProps) {
    const result = this.dbInstanceRepository.create(data);
    return this.dbInstanceRepository.save(result);
    // return await this.s3BucketRepository.save({ ...data });
  }
}

import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { RDSDetailsEntity } from '../entities/rdsDetails.entity';
import { RDSInstanceProps } from 'src/common/interfaces/rds.interface';
import { BaseRepository } from './base.repository';

@Injectable()
export class RdsDetailsRepository extends BaseRepository<
  RDSDetailsEntity,
  number
> {
  constructor(
    @InjectRepository(RDSDetailsEntity)
    private readonly dbInstanceRepository: Repository<RDSDetailsEntity>,
  ) {
    super(dbInstanceRepository);
  }
  async getAll(): Promise<RDSDetailsEntity[]> {
    return await this.dbInstanceRepository.find();
  }

  async findAllActiveDBInstances(
    params: RDSInstanceProps,
  ): Promise<Array<{ region: string; dbinstanceidentifier: string[] }>> {
    const { accountId } = params;
    const isActive = 1;
    const result = await this.dbInstanceRepository
      .createQueryBuilder('entity')
      .select('entity.Region AS region')
      .addSelect(
        'ARRAY_AGG(entity.DBInstanceIdentifier) AS dbinstanceidentifier',
      )
      .groupBy('entity.Region')
      .where('entity.AccountId= :accountId', { accountId })
      .andWhere('entity.IsActive = :isActive', { isActive })
      .getRawMany();
    return result;
  }

  async updateDBInstanceByIdentifier(
    condtions: {
      dbInstanceIdentifier: string;
      accountId: string;
      region: string;
    },
    data: RDSInstanceProps,
  ): Promise<void> {
    const { dbInstanceIdentifier, accountId, region } = condtions;
    await this.dbInstanceRepository.update(
      { dbInstanceIdentifier, accountId, region, isActive: 1 },
      { ...data },
    );
  }
}

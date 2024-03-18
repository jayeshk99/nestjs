import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
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

  async findDBInstance(params: RDSInstanceProps): Promise<RDSDetailsEntity> {
    const { accountId, dbInstanceArn } = params;
    return await this.dbInstanceRepository.findOne({
      where: { accountId, dbInstanceArn, isActive: 1 },
    });
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

  async updateDBInstance(id: number, data: RDSInstanceProps): Promise<void> {
    await this.dbInstanceRepository.update({ id }, { ...data });
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

  async createDBInstance(data: RDSInstanceProps): Promise<void> {
    const result = this.dbInstanceRepository.create(data);
    await this.dbInstanceRepository.save(result);
  }
}

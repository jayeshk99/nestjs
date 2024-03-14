import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { RDSCPUUtilizationEntity } from '../entities/rightsizing/rdsCpuUtilization.entity';
import { Between, In, Repository } from 'typeorm';
import { RdsUtilizationProps } from 'src/common/interfaces/rdsUtilizationProps.interface';

@Injectable()
export class RdsUtilizationRepository {
  constructor(
    @InjectRepository(RDSCPUUtilizationEntity)
    private readonly utilizationRepository: Repository<RDSCPUUtilizationEntity>,
  ) {}

  async deleteDuplicateUtilizationData(data: {
    accountId: string;
    dbInstanceIdentifier: string;
    metricName: string;
    startTime: Date;
    endTime: Date;
  }): Promise<void> {
    const { accountId, dbInstanceIdentifier, metricName, startTime, endTime } =
      data;
    await this.utilizationRepository.delete({
      accountId: In([accountId]),
      metricName,
      dbInstanceIdentifier,
      timestamp: Between(startTime, endTime),
    });
  }
  async addUtilizationData(data:RdsUtilizationProps[]):Promise<void>{
    const result = this.utilizationRepository.create(data);
    await this.utilizationRepository.save(result);
  }
}

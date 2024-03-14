import { Injectable } from '@nestjs/common';
import { RdsMetricService } from '../awsResources/rds/rds.metric.service';

@Injectable()
export class RDSUtilizationDataSyncService {
  constructor(private readonly rdsMetricService: RdsMetricService) {}
  async syncUtilizationData(
    accountId: string,
    startTime: Date,
    endTime: Date,
  ): Promise<void> {
    await this.rdsMetricService.syncRdsUtilizationData(
      accountId,
      startTime,
      endTime,
    );
  }
}

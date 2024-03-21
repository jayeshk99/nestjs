import { Injectable } from '@nestjs/common';
import { RDSMetricService } from '../awsResources/rds/rds.metric.service';

@Injectable()
export class RDSUtilizationDataSyncService {
  constructor(private readonly rdsMetricService: RDSMetricService) {}
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

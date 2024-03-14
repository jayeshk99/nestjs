import { Injectable } from '@nestjs/common';
import { RdsService } from '../awsResources/rds/rds.service';

@Injectable()
export class RDSUtilizationDataSyncService {
  constructor(private readonly rdsService: RdsService) {}
  async syncUtilizationData(accountId: string): Promise<void> {
    await this.rdsService.fetchRdsUtilizationData(accountId);
  }
}

import { Body, Controller, Get, Post } from '@nestjs/common';
import { AppService } from './app.service';
import { AwsInstanceRepository } from './infra/repositories/instanceDetails.repository';
import { ResourceSyncService } from './services/sync-job/resourceSync.service';
import { JobRequest } from './common/interfaces/common.interfaces';
import { RDSUtilizationDataSyncService } from './services/sync-job/rdsUtilizationDataSyncService';
import * as moment from 'moment';

@Controller()
export class AppController {
  constructor(
    private readonly awsInstanceRepository: AwsInstanceRepository,
    private readonly resourceSyncService: ResourceSyncService,
    private readonly rdsUtilizationDataSyncService: RDSUtilizationDataSyncService,
  ) {}

  @Get()
  async getHello() {
    return await this.awsInstanceRepository.getAll();
    // return this.appService.getHello();
  }
  @Post('/job')
  async startJob(@Body() body: JobRequest) {
    const startTime = new Date(
      moment().subtract(1, 'day').format('YYYY-MM-DD HH:mm'),
    );
    const endTime = new Date();
    await this.resourceSyncService.syncAllResources(
      body.accountId,
      startTime,
      endTime,
    );
    await this.rdsUtilizationDataSyncService.syncUtilizationData(
      body.accountId,
      startTime,
      endTime,
    );
    return {
      status: 200,
      message: `Aws Resource job started`,
    };
  }
}

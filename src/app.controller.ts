import { Body, Controller, Get, Post } from '@nestjs/common';
import { AppService } from './app.service';
import { AwsInstanceRepository } from './infra/repositories/instanceDetails.repository';
import { ResourceSyncService } from './services/sync-job/resourceSync.service';
import { JobRequest } from './common/interfaces/common.interfaces';
import { RDSUtilizationDataSyncService } from './services/sync-job/rdsUtilizationDataSyncService';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly awsInstanceRepository: AwsInstanceRepository,
    private readonly resourceSyncService: ResourceSyncService,
    private readonly rdsUtilizationDataSyncService: RDSUtilizationDataSyncService
  ) {}

  @Get()
  async getHello() {
    return await this.awsInstanceRepository.getAll();
    // return this.appService.getHello();
  }
  @Post('/job')
  async startJob(@Body() body: JobRequest) {
    await this.resourceSyncService.fetchAllResources(body.accountId);
    await this.rdsUtilizationDataSyncService.syncUtilizationData(body.accountId)
    return {
      status: 200,
      message: `Aws Resource job started`,
    };
  }
}

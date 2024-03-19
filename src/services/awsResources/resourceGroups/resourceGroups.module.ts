import { Module } from '@nestjs/common';

import { AwsSdkModule } from 'src/libs/aws-sdk/aws-sdk.module';
import { RepositoriesModule } from 'src/infra/repositories/repositories.module';
import { AwsHelperModule } from '../helper/helper.module';

import { ResourceGroupService } from './resourceGroups.service';

@Module({
  imports: [RepositoriesModule, AwsSdkModule, AwsHelperModule],
  providers: [ResourceGroupService],
  exports: [ResourceGroupService],
})
export class ResourceGroupModule {}
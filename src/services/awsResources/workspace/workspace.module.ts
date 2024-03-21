import { Module } from '@nestjs/common';
import { RepositoriesModule } from 'src/infra/repositories/repositories.module';

import { AwsSdkModule } from 'src/libs/aws-sdk/aws-sdk.module';
import { AwsHelperModule } from '../helper/helper.module';
import { AWSWorkspaceService } from './workspace.service';

@Module({
  imports: [RepositoriesModule, AwsSdkModule, AwsHelperModule],
  providers: [AWSWorkspaceService],
  exports: [AWSWorkspaceService],
})
export class AWSWorkspaceModule {}

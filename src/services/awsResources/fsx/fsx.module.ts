import { Module } from '@nestjs/common';
import { RepositoriesModule } from 'src/infra/repositories/repositories.module';

import { AwsSdkModule } from 'src/libs/aws-sdk/aws-sdk.module';
import { AwsHelperModule } from '../helper/helper.module';
import { FSxService } from './fsx.service';

@Module({
  imports: [RepositoriesModule, AwsSdkModule, AwsHelperModule,],
  providers: [FSxService],
  exports: [FSxService],
})
export class FsxModule {}
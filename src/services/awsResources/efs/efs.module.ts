import { Module } from '@nestjs/common';
import { RepositoriesModule } from 'src/infra/repositories/repositories.module';
import { AwsSdkModule } from 'src/libs/aws-sdk/aws-sdk.module';
import { EFSService } from './efs.service';
import { AwsHelperModule } from '../helper/helper.module';

@Module({
  imports: [RepositoriesModule, AwsHelperModule, AwsSdkModule],
  providers: [EFSService],
  exports: [EFSService],
})
export class EFSModule {}

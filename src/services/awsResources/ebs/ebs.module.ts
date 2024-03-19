import { AwsSdkModule } from 'src/libs/aws-sdk/aws-sdk.module';
import { EBSService } from './ebs.service';
import { AwsHelperModule } from '../helper/helper.module';
import { RepositoriesModule } from 'src/infra/repositories/repositories.module';
import { Module } from '@nestjs/common';

@Module({
  imports: [RepositoriesModule, AwsSdkModule, AwsHelperModule],
  providers: [EBSService],
  exports: [EBSService],
})
export class EBSModule {}

import { Module } from '@nestjs/common';
import { AwsHelperModule } from '../helper/helper.module';
import { AwsSdkModule } from 'src/libs/aws-sdk/aws-sdk.module';
import { RepositoriesModule } from 'src/infra/repositories/repositories.module';
import { SNSService } from './sns.service';

@Module({
  imports: [AwsHelperModule, AwsSdkModule, RepositoriesModule],
  providers: [SNSService],
  exports: [SNSService],
})
export class SNSModule {}

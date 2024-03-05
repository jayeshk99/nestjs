import { Module } from '@nestjs/common';
import { RepositoriesModule } from 'src/infra/repositories/repositories.module';
import { AwsSdkModule } from 'src/libs/aws-sdk/aws-sdk.module';
import { AwsHelperService } from './helper.service';

@Module({
  imports: [AwsSdkModule],
  providers: [AwsHelperService],
  exports: [AwsHelperService],
})
export class AwsHelperModule {}

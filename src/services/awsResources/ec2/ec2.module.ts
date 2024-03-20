import { Module } from '@nestjs/common';
import { EC2Service } from './ec2.service';
import { RepositoriesModule } from 'src/infra/repositories/repositories.module';
import { AwsSdkModule } from 'src/libs/aws-sdk/aws-sdk.module';
import { AwsHelperModule } from '../helper/helper.module';

@Module({
  imports: [RepositoriesModule, AwsSdkModule, AwsHelperModule],
  providers: [EC2Service],
  exports: [EC2Service],
})
export class EC2Module {}

import { Module } from '@nestjs/common';
import { ElasticIpService } from './elasticIp.service';
import { RepositoriesModule } from 'src/infra/repositories/repositories.module';
import { AwsSdkModule } from 'src/libs/aws-sdk/aws-sdk.module';
import { AwsHelperModule } from '../helper/helper.module';

@Module({
  imports: [RepositoriesModule, AwsSdkModule, AwsHelperModule],
  providers: [ElasticIpService],
  exports: [ElasticIpService],
})
export class ElasticIpModule {}

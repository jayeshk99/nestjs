import { Module } from '@nestjs/common';
import { RepositoriesModule } from 'src/infra/repositories/repositories.module';
import { AwsSdkModule } from 'src/libs/aws-sdk/aws-sdk.module';
import { AwsHelperModule } from '../helper/helper.module';
import { AWSLoadBalancerService } from './loadBalancer.service';

@Module({
  imports: [RepositoriesModule, AwsSdkModule, AwsHelperModule],
  providers: [AWSLoadBalancerService],
  exports: [AWSLoadBalancerService],
})
export class LoadBalancerModule {}

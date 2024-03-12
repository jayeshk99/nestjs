import { Module } from '@nestjs/common';
import { RepositoriesModule } from 'src/infra/repositories/repositories.module';
import { AwsSdkModule } from 'src/libs/aws-sdk/aws-sdk.module';
import { EKSService } from './ecr.service';

@Module({
  imports: [RepositoriesModule, AwsSdkModule],
  providers: [EKSService],
  exports: [EKSService],
})
export class EKSModule {}

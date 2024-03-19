import { Module } from '@nestjs/common';
import { RepositoriesModule } from 'src/infra/repositories/repositories.module';
import { AwsSdkModule } from 'src/libs/aws-sdk/aws-sdk.module';
import { ECRService } from './ecr.service';
import { AwsHelperModule } from '../helper/helper.module';
import { AwsHelperModule } from '../helper/helper.module';

@Module({
  imports: [RepositoriesModule,AwsHelperModule, AwsSdkModule],
  providers: [ECRService],
  exports: [ECRService],
})
export class ECRModule {}

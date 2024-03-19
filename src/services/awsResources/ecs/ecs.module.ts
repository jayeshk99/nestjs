import { Module } from '@nestjs/common';
import { RepositoriesModule } from 'src/infra/repositories/repositories.module';
import { AwsSdkModule } from 'src/libs/aws-sdk/aws-sdk.module';
import { ECSService } from './ecs.service';
import { AwsHelperModule } from '../helper/helper.module';

@Module({
  imports: [RepositoriesModule, AwsSdkModule, AwsHelperModule],
  providers: [ECSService],
  exports: [ECSService],
})
export class ECSModule {}

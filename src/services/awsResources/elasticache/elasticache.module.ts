import { Module } from '@nestjs/common';
import { AwsSdkModule } from 'src/libs/aws-sdk/aws-sdk.module';
import { AwsHelperModule } from '../helper/helper.module';
import { RepositoriesModule } from 'src/infra/repositories/repositories.module';
import { ElastiCacheService } from './elasticache.service';

@Module({
  imports: [AwsSdkModule, AwsHelperModule, RepositoriesModule],
  providers: [ElastiCacheService],
  exports: [ElastiCacheService],
})
export class ElastiCacheModule {}

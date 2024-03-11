import { Module } from '@nestjs/common';
import { RepositoriesModule } from 'src/infra/repositories/repositories.module';
import { AwsSdkModule } from 'src/libs/aws-sdk/aws-sdk.module';
import { AwsHelperModule } from '../helper/helper.module';
import { S3GlacierService } from './s3Glacier.service';

@Module({
  imports: [RepositoriesModule, AwsSdkModule, AwsHelperModule],
  providers: [S3GlacierService],
  exports: [S3GlacierService],
})
export class S3GlacierModule {}

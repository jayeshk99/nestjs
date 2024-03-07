import { Module } from '@nestjs/common';
import { RepositoriesModule } from 'src/infra/repositories/repositories.module';
import { AwsSdkModule } from 'src/libs/aws-sdk/aws-sdk.module';
import { EFSService } from './efs.service';

@Module({
  imports: [RepositoriesModule, AwsSdkModule],
  providers: [EFSService],
  exports: [EFSService],
})
export class EFSModule {}

import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './infra/database/database.module';
import { RepositoriesModule } from './infra/repositories/repositories.module';
import { SyncJobModule } from './services/sync-job/sync-job.module';

@Module({
  imports: [DatabaseModule, RepositoriesModule, SyncJobModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

// TODO: logger, exception handler,

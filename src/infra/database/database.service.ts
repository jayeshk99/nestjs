import { Injectable } from '@nestjs/common';
import {
  TypeOrmModule,
  TypeOrmModuleOptions,
  TypeOrmOptionsFactory,
} from '@nestjs/typeorm';
import { EnvironmentService } from '../environment/environment.service';
@Injectable()
export class DatabaseService implements TypeOrmOptionsFactory {
  constructor(private readonly environmentService: EnvironmentService) {}
  createTypeOrmOptions(
    connectionName?: string,
  ): TypeOrmModuleOptions | Promise<TypeOrmModuleOptions> {
    return {
      type: 'postgres',
      host: this.environmentService.getDatabaseHost(),
      username: this.environmentService.getDatabaseUser(),
      password: this.environmentService.getDatabasePassword(),
      database: this.environmentService.getDatabaseName(),
      //   entities: [...EntityLists],
      autoLoadEntities: true,
      synchronize: false,
      logging: false,
    };
  }
  4;
}

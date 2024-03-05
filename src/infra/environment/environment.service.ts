import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
@Injectable()
export class EnvironmentService {
  constructor(private readonly configService: ConfigService) {}

  getDatabaseHost(): string {
    return this.configService.get<string>('CLOUDFORESTX_DB_HOST');
  }
  getDatabasePort(): number {
    return this.configService.get<number>('CLOUDFORESTX_DB_PORT');
  }
  getDatabaseUser(): string {
    return this.configService.get<string>('CLOUDFORESTX_DB_USER');
  }
  getDatabasePassword(): string {
    return this.configService.get<string>('CLOUDFORESTX_DB_USER_PWD');
  }
  getDatabaseName(): string {
    return this.configService.get<string>('CLOUDFORESTX_DB_NAME');
  }
}

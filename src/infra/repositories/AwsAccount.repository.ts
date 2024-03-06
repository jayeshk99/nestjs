import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AWSAccountsEntity } from '../entities/awsAccount.entity';
import { Repository } from 'typeorm';

@Injectable()
export class AwsAccountRepository {
  constructor(
    @InjectRepository(AWSAccountsEntity)
    private readonly awsAccountRepository: Repository<AWSAccountsEntity>,
  ) {}
  async getAccountDetails(accountId: string): Promise<AWSAccountsEntity> {
    return await this.awsAccountRepository.findOne({
      where: { accountId, isActive: 1, credentials: true },
    });
  }
}

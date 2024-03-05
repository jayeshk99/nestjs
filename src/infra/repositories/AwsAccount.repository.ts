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
  async getAccountDetails(AccountId: string): Promise<AWSAccountsEntity> {
    return await this.awsAccountRepository.findOne({
      where: { AccountId, IsActive: 1, Credentials: true },
    });
  }
}

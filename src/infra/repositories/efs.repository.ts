import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { EFSEntity } from '../entities/efsDetails.entity';
import { EFSProps } from 'src/common/interfaces/efs.interface';

@Injectable()
export class EFSRepository {
  constructor(
    @InjectRepository(EFSEntity)
    private readonly efsRepository: Repository<EFSEntity>,
  ) {}

  async findEFS(params: EFSProps) {
    const { accountId, fileSystemId } = params;
    return await this.efsRepository.findOne({
      where: { accountId, fileSystemId, isActive: 1 },
    });
  }

  async updateEfs(id: number, data: EFSProps) {
    return await this.efsRepository.update({ id }, { ...data });
  }

  async createEfs(data: EFSProps) {
    const result = this.efsRepository.create(data);
    return this.efsRepository.save(result);
    // return await this.s3BucketRepository.save({ ...data });
  }
}

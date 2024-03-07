import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { FsxFileSystemProps } from 'src/common/interfaces/fsx.interface';
import { FSxEntity } from '../entities/fsxDetails.entity';

@Injectable()
export class FsxDetailsRepository {
  constructor(
    @InjectRepository(FSxEntity)
    private readonly fsxRepository: Repository<FSxEntity>,
  ) {}

  async findFsxFileSystem(params: FsxFileSystemProps) {
    const { accountId, fileSystemId, region } = params;
    return await this.fsxRepository.findOne({
      where: { accountId, fileSystemId, region, isActive: 1 },
    });
  }

  async updateFsxFileSystem(id: number, data: FsxFileSystemProps) {
    return await this.fsxRepository.update({ id }, { ...data });
  }

  async createFsxFileSystem(data: FsxFileSystemProps) {
    const result = this.fsxRepository.create(data);
    return await this.fsxRepository.save(result);
  }
}

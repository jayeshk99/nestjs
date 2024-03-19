import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { EBSEntity } from '../entities/ebsDetails.entity';
import { EBSVolumeProps } from 'src/common/interfaces/ebs.interface';

@Injectable()
export class EBSRepository {
  private logger = new Logger(EBSRepository.name);
  constructor(
    @InjectRepository(EBSEntity)
    private readonly ebsRepository: Repository<EBSEntity>,
  ) {}

  async findVolume(
    data: EBSVolumeProps,
  ): Promise<EBSEntity> {
    const { accountId, volumeId } = data;
    return await this.ebsRepository.findOne({
      where: { accountId, volumeId, isActive: 1 },
    });
  }

  async addEBSVolume(data: EBSVolumeProps): Promise<void> {
    try {
      const result = this.ebsRepository.create(data);
      await this.ebsRepository.save(result);
    } catch (error) {
      this.logger.log(
        `error while adding ebs volume for account:${data.accountId} region:${data.region} error:${error}`,
      );
    }
  }

  async updateEBSVolume(
    id: number,
    data: EBSVolumeProps,
  ): Promise<void> {
    try {
      await this.ebsRepository.update({ id }, { ...data });
    } catch (error) {
      this.logger.log(
        `error while updating ebs volume for account:${data.accountId} region:${data.region} error:${error}`,
      );
    }
  }
}

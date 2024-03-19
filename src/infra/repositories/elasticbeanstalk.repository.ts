import { Injectable } from '@nestjs/common';
import { ElasticBeanstalkEntity } from '../entities/elasticBeanstalkDetails.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { ElasticBeanStalkProps } from 'src/common/interfaces/elasticBeanstalk.interface';

@Injectable()
export class BeanStalkRepository {
  constructor(
    @InjectRepository(ElasticBeanstalkEntity)
    private readonly beanStalkRepository: Repository<ElasticBeanstalkEntity>,
  ) {}

  async findApplication(data: ElasticBeanStalkProps) {
    const { accountId, appArn, region } = data;
    return await this.beanStalkRepository.findOne({
      where: { accountId, appArn, region },
    });
  }

  async updateBeanStalkApplication(id: number, data: ElasticBeanStalkProps) {
    await this.beanStalkRepository.update(id, { ...data });
  }
  async addBeanStalkApplication(data: ElasticBeanStalkProps) {
    const result = this.beanStalkRepository.create(data);
    await this.beanStalkRepository.save(result);
  }
}

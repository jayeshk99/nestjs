import {
  DescribeCacheClustersCommand,
  DescribeCacheClustersCommandInput,
  DescribeCacheClustersCommandOutput,
  ElastiCacheClient,
} from '@aws-sdk/client-elasticache';
import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class ElastiCacheSdkService {
  private readonly logger = new Logger(ElastiCacheSdkService.name);
  constructor() {}
  async listCacheClusters(client: ElastiCacheClient) {
    try {
      const allresources: DescribeCacheClustersCommandOutput['CacheClusters'] =
        [];
      const input: DescribeCacheClustersCommandInput = {};
      let nextToken = null;
      do {
        if (nextToken) {
          input.Marker = nextToken;
        } else {
          delete input.Marker;
        }
        const { CacheClusters, Marker } = await client.send(
          new DescribeCacheClustersCommand(input),
        );
        if (CacheClusters.length) {
          allresources.push(...CacheClusters);
        }
        nextToken = Marker;
      } while (nextToken);
      return allresources;
    } catch (error) {}
  }
}

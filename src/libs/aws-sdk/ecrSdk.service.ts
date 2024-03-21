import { Injectable } from '@nestjs/common';
import { ListResourcesProps } from 'src/common/interfaces/awsClient.interface';
import {
  DescribeRepositoriesCommand,
  DescribeRepositoriesCommandInput,
  DescribeRepositoriesCommandOutput,
  ECRClient,
  ListImagesCommand,
  ListImagesCommandInput,
  ListImagesCommandOutput,
} from '@aws-sdk/client-ecr';
@Injectable()
export class ECRSdkService {
  async listEcr(
    ecrClient: ECRClient,
  ): Promise<DescribeRepositoriesCommandOutput['repositories']> {
    const allresources: DescribeRepositoriesCommandOutput['repositories'] = [];
    let nextToken: string | null = null;
    // TODO: implement enum for possible values for different resource/ make on global config or enum for aws resources
    const inputParams: DescribeRepositoriesCommandInput = {};
    do {
      try {
        if (nextToken) {
          inputParams.nextToken = nextToken;
        } else {
          delete inputParams.nextToken;
        }

        const data = await ecrClient.send(
          new DescribeRepositoriesCommand(inputParams),
        );
        const resources = data.repositories;

        if (resources && resources.length > 0) {
          allresources.push(...resources);
        }

        nextToken = data.nextToken;
      } catch (error) {
        console.error(`Error listing Ecr List:`, error);
        break;
      }
    } while (nextToken);
    return allresources;
  }

  async listImages(
    ecrClient: ECRClient,
    data: ListImagesCommandInput,
  ): Promise<ListImagesCommandOutput> {
    const { registryId, repositoryName } = data;
    return await ecrClient.send(
      new ListImagesCommand({ registryId, repositoryName }),
    );
  }
}

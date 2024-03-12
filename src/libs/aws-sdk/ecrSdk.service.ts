import { Injectable } from '@nestjs/common';
import { ListResourcesProps } from 'src/common/interfaces/awsClient.interface';
import * as AWS from 'aws-sdk';
import { Repository, ListImagesRequest } from 'aws-sdk/clients/ecr';
@Injectable()
export class ECRSdkService {
  async listEcr(ecrClient: AWS.ECR) {
    let ecrList: Repository[] = [];
    let nextToken: string | null = null;
    // TODO: implement enum for possible values for different resource/ make on global config or enum for aws resources
    let inputParams: ListResourcesProps = {};
    do {
      try {
        if (nextToken) {
          inputParams.nextToken = nextToken;
        } else {
          delete inputParams.nextToken;
        }

        const data = await ecrClient
          .describeRepositories(inputParams)
          .promise();
        const resources = data.repositories;

        if (resources && resources.length > 0) {
          ecrList.push(...resources);
        }

        nextToken = data.nextToken;
      } catch (error) {
        console.error(`Error listing Ecr List:`, error);
        break;
      }
    } while (nextToken);
    return ecrList;
  }

  async listImages(ecrClient: AWS.ECR, data: ListImagesRequest) {
    const { registryId, repositoryName } = data;
    const images = await ecrClient
      .listImages({ registryId, repositoryName })
      .promise();
    return images;
  }
}

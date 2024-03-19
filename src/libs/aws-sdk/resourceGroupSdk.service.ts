import {
  ListGroupsCommand,
  ListGroupsCommandInput,
  ListGroupsCommandOutput,
  ResourceGroupsClient,
} from '@aws-sdk/client-resource-groups';
import { Injectable } from '@nestjs/common';

@Injectable()
export class ResourceGroupSdkService {
  constructor() {}
  async listResourceGroups(
    resourceGroupClient: ResourceGroupsClient,
  ): Promise<ListGroupsCommandOutput['GroupIdentifiers']> {
    const allResources: ListGroupsCommandOutput['GroupIdentifiers'] = [];
    const rgListParams: ListGroupsCommandInput = {
      MaxResults: 50,
      NextToken: null,
    };
    let nextToken = null;
    do {
      if (nextToken) {
        rgListParams.NextToken = nextToken;
      } else {
        delete rgListParams.NextToken;
      }
      const data = await resourceGroupClient.send(
        new ListGroupsCommand(rgListParams),
      );

      const resources = data.GroupIdentifiers;

      if (resources && resources.length > 0) {
        allResources.push(...resources);
      }

      nextToken = data.NextToken;
    } while (nextToken);
    return allResources;
  }
}

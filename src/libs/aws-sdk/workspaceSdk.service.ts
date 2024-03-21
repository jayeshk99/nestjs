import { Injectable } from '@nestjs/common';
import {
  DescribeWorkspacesCommand,
  DescribeWorkspacesCommandInput,
  DescribeWorkspacesCommandOutput,
  DescribeWorkspacesConnectionStatusCommand,
  WorkSpacesClient,
} from '@aws-sdk/client-workspaces';
@Injectable()
export class AWSWorkspaceSdkService {
  async listWorkspaces(workspaceClient: WorkSpacesClient) {
    let workspaceList: DescribeWorkspacesCommandOutput['Workspaces'] = [];
    let nextToken: string | null = null;
    let inputParams: DescribeWorkspacesCommandInput = {};
    do {
      try {
        if (nextToken) {
          inputParams.NextToken = nextToken;
        } else {
          delete inputParams.NextToken;
        }

        const data = await workspaceClient.send(
          new DescribeWorkspacesCommand(inputParams),
        );
        const resources = data.Workspaces;
        if (resources && resources.length > 0) {
          workspaceList.push(...resources);
        }

        nextToken = data.NextToken || null;
      } catch (error) {
        console.error(`Error listing Workspaces List:`, error);
        break;
      }
    } while (nextToken);
    return workspaceList;
  }

  async describeWorkspaceConnection(
    workspaceClient: WorkSpacesClient,
    workspaceId: string,
  ) {
    const clusterDesc = await workspaceClient.send(
      new DescribeWorkspacesConnectionStatusCommand({
        WorkspaceIds: [workspaceId],
      }),
    );
    return clusterDesc.WorkspacesConnectionStatus;
  }
}

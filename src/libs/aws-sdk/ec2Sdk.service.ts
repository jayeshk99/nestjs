import { Injectable } from '@nestjs/common';
import {
  DescribeAddressesCommand,
  DescribeAddressesCommandInput,
  DescribeAddressesCommandOutput,
  DescribeRegionsCommand,
  DescribeVolumesCommand,
  DescribeVolumesCommandInput,
  DescribeVolumesCommandOutput,
  EC2Client,
} from '@aws-sdk/client-ec2';
@Injectable()
export class EC2SdkService {
  // TODO: types of sdk objects
  async getEnabledRegions(EC2Client: EC2Client) {
    return await EC2Client.send(new DescribeRegionsCommand({}));
  }

  async listEBSVolumes(
    client: EC2Client,
  ): Promise<DescribeVolumesCommandOutput['Volumes']> {
    const allresources: DescribeVolumesCommandOutput['Volumes'] = [];
    let listVolumeParams: DescribeVolumesCommandInput = {
      MaxResults: 50,
      NextToken: null,
    };
    let nextToken = null;
    do {
      if (nextToken) {
        listVolumeParams.NextToken = nextToken;
      } else {
        delete listVolumeParams.NextToken;
      }
      const data = await client.send(
        new DescribeVolumesCommand(listVolumeParams),
      );
      const resources = data.Volumes;

      if (resources && resources.length > 0) {
        allresources.push(...resources);
      }

      nextToken = data.NextToken;
    } while (nextToken);
    return allresources;
  }

  async listIpAddresses(client: EC2Client) {
    const allresources: DescribeAddressesCommandOutput['Addresses'] = [];
    let listaddressesParams: DescribeAddressesCommandInput = {};
    let nextToken = null;
    do {
      const { Addresses } = await client.send(
        new DescribeAddressesCommand(listaddressesParams),
      );
      if (Addresses.length) {
        allresources.push(...Addresses);
      }
    } while (nextToken);
    return allresources;
  }
}

import { Injectable } from '@nestjs/common';
import { DescribeRegionsCommand, EC2Client } from '@aws-sdk/client-ec2';
@Injectable()
export class EC2SdkService {
  // TODO: types of sdk objects
  async getEnabledRegions(EC2Client: EC2Client) {
    return await EC2Client.send(new DescribeRegionsCommand({}));
  }
}

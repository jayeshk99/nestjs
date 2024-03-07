import { Injectable } from '@nestjs/common';
import * as AWS from 'aws-sdk';
@Injectable()
export class EC2SdkService {
  // TODO: types of sdk objects
  async getEnabledRegions(EC2Client: AWS.EC2) {
    return await EC2Client.describeRegions().promise();
  }
}

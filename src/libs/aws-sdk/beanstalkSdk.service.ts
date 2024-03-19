import {
  DescribeApplicationsCommand,
  DescribeApplicationsCommandInput,
  DescribeApplicationsCommandOutput,
  ElasticBeanstalkClient,
} from '@aws-sdk/client-elastic-beanstalk';
import { Injectable } from '@nestjs/common';

@Injectable()
export class BeanStalkSdkService {
  constructor() {}
  async listApplications(client: ElasticBeanstalkClient) {
    const allresources: DescribeApplicationsCommandOutput['Applications'] = [];
    const input: DescribeApplicationsCommandInput = {};
    const { Applications } = await client.send(
      new DescribeApplicationsCommand({}),
    );
    if (Applications.length) {
      allresources.push(...Applications);
    }
    return allresources;
  }
}

import {
  CloudTrailClient,
  LookupEventsCommand,
  LookupEventsCommandInput,
  LookupEventsCommandOutput,
} from '@aws-sdk/client-cloudtrail';
import { Injectable } from '@nestjs/common';

@Injectable()
export class CloudTrailSdkService {
  constructor() {}

  async getLatestEventHistory(
    cloudTrailClient: CloudTrailClient,
    lookUpEvent: LookupEventsCommandInput,
    resourceName: string,
    serviceName: string,
  ): Promise<string> {
    let nextToken = null;
    let lastModified: Date;
    do {
      if (nextToken) {
        lookUpEvent.NextToken = nextToken;
      } else {
        delete lookUpEvent.NextToken;
      }
      const trailData = await cloudTrailClient.send(
        new LookupEventsCommand(lookUpEvent),
      );
      if (trailData && trailData.Events && trailData.Events.length) {
        const filteredData = trailData.Events.filter(
          (event) => !event.ReadOnly,
        );
        const foundEvent = filteredData.find((data) => {
          if (
            serviceName === 'resource groups' &&
            JSON.parse(data.CloudTrailEvent)?.requestParameters?.GroupName ===
              resourceName
          ) {
            lastModified = data.EventTime;
            return true;
          } else if (
            serviceName === 'elastic container service' &&
            JSON.parse(data.CloudTrailEvent)?.responseElements.containerInstance
              .containerInstanceArn === resourceName
          ) {
            lastModified = data.EventTime;
            return true;
          }
          return false;
        });
        if (foundEvent) {
          return lastModified.toString();
        }
      }
      nextToken = trailData.NextToken;
    } while (nextToken);
    return;
  }
}

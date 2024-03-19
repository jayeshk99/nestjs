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
        filteredData.forEach((data) => {
          if (
            JSON.parse(data.CloudTrailEvent)?.requestParameters?.GroupName ===
            resourceName
          ) {
            lastModified = JSON.parse(data.CloudTrailEvent)?.eventTime;
            return lastModified;
          }
        });
      }
      nextToken = trailData.NextToken;
    } while (nextToken);
    return;
  }
}

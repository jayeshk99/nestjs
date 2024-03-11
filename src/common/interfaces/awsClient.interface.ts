export interface AwsClientRequest {
  region: string;
  credentials: {
    accessKeyId: string;
    secretAccessKey: string;
  };
}

export interface ClientCredentials {
  accessKeyId: string;
  secretAccessKeyId: string;
  accountId: string;
  region: string;
}

export interface AWSMetricProps {
  Id?: number;
  AccountId?: string;
  InstanceId?: string;
  StartTime?: Date;
  EndTime?: Date;
  Namespace: string;
  service?: string;
  Period?: number;
  MetricName: string;
  Statistics?: string[];
  TimeStamp?: string;
  Dimensions: { Name: string; Value: string }[];
}

export interface ListResourcesProps {
  Marker?: string;
  NextMarker?: string;
  Token?: string;
  NextToken?: string;
  marker?: string;
  nextMarker?: string;
  nextToken?: string;
  MaxResults?: number;
}

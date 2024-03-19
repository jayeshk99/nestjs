export const REGIONS = {
  US_EAST_2: 'us-east-2',
  US_EAST_1: 'us-east-1',
  US_WEST_1: 'us-west-1',
  US_WEST_2: 'us-west-2',
  AF_SOUTH_1: 'af-south-1',
  AP_EAST_1: 'ap-east-1',
  AP_SOUTH_2: 'ap-south-2',
  AP_SOUTHEAST_3: 'ap-southeast-3',
  AP_SOUTHEAST_4: 'ap-southeast-4',
  AP_SOUTH_1: 'ap-south-1',
  AP_NORTHEAST_3: 'ap-northeast-3',
  AP_NORTHEAST_2: 'ap-northeast-2',
  AP_SOUTHEAST_1: 'ap-southeast-1',
  AP_SOUTHEAST_2: 'ap-southeast-2',
  AP_NORTHEAST_1: 'ap-northeast-1',
  CA_CENTRAL_1: 'ca-central-1',
  CA_WEST_1: 'ca-west-1',
  EU_CENTRAL_1: 'eu-central-1',
  EU_WEST_1: 'eu-west-1',
  EU_WEST_2: 'eu-west-2',
  EU_SOUTH_1: 'eu-south-1',
  EU_WEST_3: 'eu-west-3',
  EU_SOUTH_2: 'eu-south-2',
  EU_NORTH_1: 'eu-north-1',
  EU_CENTRAL_2: 'eu-central-2',
  IL_CENTRAL_1: 'il-central-1',
  ME_SOUTH_1: 'me-south-1',
  ME_CENTRAL_1: 'me-central-1',
  SA_EAST_1: 'sa-east-1',
};

export const AWS_NAME_SPACES = {
  EC2: 'AWS/EC2',
  EBS: 'AWS/EBS',
  EFS: 'AWS/EFS',
  S3: 'AWS/S3',
  ElastiCache: 'AWS/ElastiCache',
  RDS: 'AWS/RDS',
};

export const AWS_METRIC_NAMES = {
  CPU_UTILIZATION: 'CPUUtilization',
  NETWORK_IN: 'NetworkIn',
  NETWORK_OUT: 'NetworkOut',
  DISK_READ_BYTES: 'DiskReadBytes',
  DISK_WRITE_BYTES: 'DiskWriteBytes',
  BUCKET_SIZE_BYTES: 'BucketSizeBytes',
  CACHE_HITS: 'CacheHits',
  RDS_WRITE_IOPS: 'WriteIOPS',
  RDS_READ_IOPS: 'ReadIOPS',
  RDS_DATABASE_CONNECTIONS: 'DatabaseConnections',
};

export const AWS_CLIENT_NAME = {
  S3_BUCKET: 's3Bucket',
  EFS: 'efs',
  FSx: 'fsx',
  EC2: 'ec2',
  ECR: 'ecr',
  CLOUD_WATCH: 'cloudWatch',
  CLOUD_WATCH_CLIENT: 'cloudWatchClient',
  RESOURCE_GROUP: 'resourceGroup',
  EBS: 'ebs',
  LOAD_BALANCER: 'loadBalancer',
  ACCOUNT: 'account',
  STS: 'sts',
  ELASTICACHE: 'elastiCache',
  ECS: 'ecs',
  SQS: 'sqs',
  ELB: 'loadBalancer',
  ELASTIC_BEANSTALK: 'elasticBeanstalk',
  GLOBAL_ACCELERATOR: 'globalAccelerator',
  WORKSPACE: 'workspace',
  DYNAMO_DB: 'dynamodb',
  RDS: 'rds',
  EMR: 'emr',
  SNS: 'sns',
  S3GLACIER: 's3Glacier',
  CLOUD_TRAIL: 'cloudTrail',
  ASG: 'autoScalingGroup',
  EKS: 'eks',
  LAMBDA: 'lambda',
};

export const PRODUCT_CODE = {
  EC2: 'AmazonEC2',

  S3: 'AmazonS3',

  EFS: 'AmazonEFS',

  FSx: 'AmazonFSx',

  'S3 Glacier': 'AmazonGlacier',

  EBS: 'AmazonEC2',

  'Elastic IP addresses': 'NA',

  'AWS Load Balancers': 'AWSELB',

  'AWS Resource Groups': 'NA',

  'Elastic BeanStalk': 'AWSElasticBeanstalk',

  'Elastic Container Service Instance': 'AmazonECS',

  'Elastic Cache': 'AmazonElastiCache',

  'Simple Queue Service': 'AWSQueueService',

  'Global Accelerator': 'AWSGlobalAccelerator',

  RDS: 'AmazonRDS',

  DynamoDB: 'AmazonDynamoDB',

  Workspaces: 'AmazonWorkSpaces',

  EMR: 'ElasticMapReduce',

  SNS: 'AmazonSNS',

  ECR: 'AmazonECR',

  EKS: 'AmazonEKS',

  Lambda: 'AWSLambda',
};

export const LIST_RESOURCE_KEY = {
  S3_BUCKET: 'Buckets',
  EFS: 'FileSystems',
  FSx: 'FileSystems',
  S3GLACIER: 'VaultList',
  RDS: 'DBInstances',
  ECR: 'repositories',
  EKS: 'clusters',
  LOAD_BALANCER: 'LoadBalancerDescriptions',
  LOAD_BALANCER_V2: 'LoadBalancers',
  RESOURCE_GROUP: 'Groups',
  EBS: 'Volumes',
  ECS: 'clusterArns',
  EMR: 'Clusters',
  SQS: 'QueueUrls',
  SNS: 'Topics',
  ELASTICACHE: 'CacheClusters',
  WORKSPACE: 'Workspaces',
  LAMBDA: 'Functions',
  EC2: 'NA',
  CLOUD_WATCH: 'NA',
  CLOUD_WATCH_CLIENT: 'NA',
  ACCOUNT: 'NA',
  STS: 'NA',
  ELB: 'NA',
  ELASTIC_BEANSTALK: 'NA',
  GLOBAL_ACCELERATOR: 'NA',
  DYNAMO_DB: 'NA',
  CLOUD_TRAIL: 'NA',
  ASG: 'NA',
};

export const LOOK_UP_EVENT = {
  EC2: "ec2.amazonaws.com",
  S3: "s3.amazonaws.com",
  Glacier: "glacier.amazonaws.com",
  EFS: "elasticfilesystem.amazonaws.com",
  FSx: "fsx.amazonaws.com",
  ResourceGroups: "resource-groups.amazonaws.com",
  SNS: "sns.amazonaws.com",
  EMR: "elasticmapreduce.amazonaws.com",
  ECS: "ecs.amazonaws.com",
};
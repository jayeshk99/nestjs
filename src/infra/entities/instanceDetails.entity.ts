import {
  BeforeInsert,
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({ name: 'InstanceDetails' })
export class AwsInstanceEntity {
  @PrimaryGeneratedColumn({ name: 'Id' })
  id: number;

  @Column({ name: 'InstanceId' })
  instanceId: string;

  @Column({ name: 'OrgId' })
  orgId: string;

  @Column({ name: 'AccountId' })
  accountId: string;

  @Column({ name: 'InstanceName' })
  instanceName: string;

  @Column({ name: 'InstanceLocation' })
  instanceLocation: string;

  @Column({ name: 'InstanceSize' })
  instanceSize: string;

  @Column({ name: 'OSType' })
  osType: string;

  @Column({ name: 'InstanceStorageAccountType' })
  instanceStorageAccountType: string;

  @Column({ name: 'OSName' })
  osName: string;

  @Column({ name: 'OSVersion' })
  osVersion: string;

  @Column({ name: 'InstancePricePerHour' })
  instancePricePerHour: number;

  @Column({ name: 'InstanceStatus' })
  instanceStatus: string;

  @Column({ name: 'InstanceStatusTime' })
  instanceStatusTime: Date;

  @Column({ name: 'InstanceMemory' })
  instanceMemory: number;

  @Column({ name: 'InstanceAverageUsage', default: 0 })
  instanceAverageUsage: number;

  @Column({ name: 'InstanceAvgNetworkIn', default: 0 })
  instanceAvgNetworkIn: number;

  @Column({ name: 'InstanceAvgNetworkOut', default: 0 })
  instanceAvgNetworkOut: number;

  @Column({ name: 'InstancePeakCPU', default: 0 })
  instancePeakCPU: number;

  @Column({ name: 'InstanceDiskSize' })
  instanceDiskSize: number;

  @Column({ name: 'CurrencyCode' })
  currencyCode: string;

  @Column({ name: 'DeleteOnTermination' })
  deleteOnTermination: boolean;

  @Column({ name: 'Days', default: 1 })
  days: number;

  @Column({ name: 'UpperThreshold', default: 70 })
  upperThreshold: number;

  @Column({ name: 'IsActive', default: 1 })
  isActive: number;

  @Column({ name: 'IsDisabled', default: 0 })
  isDisabled: number;

  @Column({ name: 'IsRecommendationAccepted', default: 0 })
  isRecommendationAccepted: number;

  @Column({ name: 'InstanceDiskId' })
  instanceDiskId: string;

  @Column({ name: 'InstanceNetworkInterfaceId' })
  instanceNetworkInterfaceId: string;

  @Column({ name: 'Savings', default: 0 })
  savings: number;

  @Column({ name: 'LastEndTime' })
  lastEndTime: Date;

  @Column({ name: 'UpscaleTime', default: 0 })
  upscaleTime: number;

  @Column({ name: 'ThresholdUpdatedTime' })
  thresholdUpdatedTime: Date;

  @Column({ name: 'IsResized', default: 0 })
  isResized: number;

  @Column({ name: 'VirtualizationType' })
  virtualizationType: string;

  @Column({ name: 'Hypervisor' })
  hypervisor: string;

  @Column({ name: 'AutoScalingGroup' })
  autoScalingGroup: string;

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt: Date;

  @Column({ name: 'InstanceLifecycle' })
  InstanceLifecycle: string;

  @Column({ name: 'CpuCores' })
  cpuCores: number;

  @Column({ name: 'ThreadsPerCore' })
  threadsPerCore: number;

  @Column({ name: 'AmiId' })
  amiId: string;

  @Column({ name: 'Tenancy' })
  tenancy: string;

  @Column({ name: 'AvailabilityZone' })
  availabilityZone: string;

  @Column({ name: 'VpcId' })
  vpcId: string;

  @Column({ name: 'SubnetId' })
  subnetId: string;

  @Column({ name: 'PublicDns' })
  publicDns: string;

  @Column({ name: 'PrivateDns' })
  privateDns: string;

  @Column({ name: 'PublicIp' })
  publicIp: string;

  @Column({ name: 'PrivateIp' })
  privateIp: string;

  @Column({ name: 'CreatedBy' })
  createdBy: number;

  @Column({ name: 'UpdatedBy' })
  updatedBy: number;

  @Column({ name: 'IpAddress' })
  ipAddress: string;

  @Column({ name: 'KeyName' })
  keyName: string;

  @Column({ name: 'LaunchTime' })
  launchTime: Date;

  @Column({ name: 'MonitoringState' })
  monitoringState: string;

  @Column({ name: 'SecurityGroups' })
  securityGroups: string;

  @BeforeInsert()
  updateTime() {
    this.createdAt = new Date();
    this.updatedAt = new Date();
  }
}

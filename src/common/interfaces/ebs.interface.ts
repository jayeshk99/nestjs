export interface EBSVolumeProps{
    id?: number;
    accountId?: string;
    volumeId?: string;
    ec2InstanceId?: string;
    snapshotId?: string;
    encrypted?: boolean;
    size?: number;
    unit?: string;
    state?: string;
    volumeType?: string;
    deleteOnTermination?: boolean;
    vmState?: string;
    createdOn?: Date;
    region?: string;
    isActive?: number;
    type?: number;
    unusedCreatedOn?: Date;
    isDisabled?: number;
    monthlyCost?: number;
    currencyCode?: string;
   
}
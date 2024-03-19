export interface ResourceGroupProps{
    accountId?: string;
    resourceGroupName?: string;
    resourceGroupArn?: string;
    description?: string;
    region?: string;
    lastModified?: string;
    isActive?: number;
    type?: number;
    unusedCreatedOn?: Date;
    isDisabled?: number;
    createdBy?: number;
    updatedBy?: number;
    ipAddress?: string;
}
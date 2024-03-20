export interface ElasticIpProps{
    id?: number;
    accountId?: string;
    elasticIPName?: string;
    ipAddress?: string;
    location?: string;
    instanceId?: string;
    networkInterfaceId?: string;
    associationId?: string;
    isActive?: number;
    type?: number;
    unusedCreatedOn?: Date;
    isDisabled?: number;
    publicIpv4Pool?: string;
    currencyCode?: string;
    monthlyCost?: number;
    allocationId?: string;
    
}
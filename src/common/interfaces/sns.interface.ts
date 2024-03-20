export interface SNSTopicProps{
    id?: number;
    accountId?: string;
    snsName?: string;
    snsTier?: string;
    arn?: string;
    owner?: string;
    subscriptionsPending?: string;
    subscriptionsConfirmed?: string;
    displayName?: string;
    subscriptionsDeleted?: string;
    lastModified?: Date;
    region?: string;
    isActive?: number;
    type?: number;
    unusedCreatedOn?: Date;
    isDisabled?: number;
    currencyCode?: string;
    monthlyCost?: number;
}
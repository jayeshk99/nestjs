import { Injectable, Logger } from "@nestjs/common";
import { ClientCredentials } from "src/common/interfaces/awsClient.interface";
import { ClientConfigurationService } from "src/libs/aws-sdk/clientConfiguration.service";
import { ElastiCacheSdkService } from "src/libs/aws-sdk/elaticacheSdk.service";

@Injectable()
export class ElastiCacheService{
    private readonly logger=new Logger(ElastiCacheService.name)
    constructor(private readonly clientConfigurationService:ClientConfigurationService,
        private readonly elastiCacheSdkService:ElastiCacheSdkService){}
    async syncCacheClusters(data:ClientCredentials){
        try {
            this.logger.log(  `started Syncing Cache clusters for account:${data.accountId} region:${data.region}`,);
            const {accountId,accessKeyId,secretAccessKey,region,currencyCode}=data
            const cacheClient=await this.clientConfigurationService.getElastiCacheClient(data);
            const clusterList=await this.elastiCacheSdkService.listCacheClusters(cacheClient)
    if(clusterList.length)
    {
        for(let i=0;i<clusterList.length;i++){
            
        }
    }
            this.logger.log(  `started Syncing Cache clusters for account:${data.accountId} region:${data.region}`,);
            
        } catch (error) {
           this.logger.log(  `Error in syncing cache Details for account: ${data.accountId} region: ${data.region}: Error: ${error}`,) 
        }
       
    }
}
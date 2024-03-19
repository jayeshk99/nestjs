import { Injectable, Logger } from "@nestjs/common";
import { ClientCredentials } from "src/common/interfaces/awsClient.interface";
import { ElasticIpProps } from "src/common/interfaces/elasticIp.interface";
import { ElasticIpRepository } from "src/infra/repositories/elasticIp.Repository";
import { ClientConfigurationService } from "src/libs/aws-sdk/clientConfiguration.service";
import { EC2SdkService } from "src/libs/aws-sdk/ec2Sdk.service";

@Injectable()
export class ElasticIpService{
    private readonly logger = new Logger(ElasticIpService.name);
    constructor(private readonly clientConfigurationService:ClientConfigurationService,private readonly ec2SdkService:EC2SdkService,private readonly elasticIpRepository:ElasticIpRepository){}
    async syncIpAddresses(data:ClientCredentials):Promise<void>{
        try {
            this.logger.log(
              `Elastic Ip details job STARTED for account: ${data.accountId} region: ${data.region}`,
            );
            const { accessKeyId, secretAccessKey, accountId, region, currencyCode } =
              data;
            const elasticIpClient =
              await this.clientConfigurationService.getEC2Client(data);
            const elasticIpAddresses = await this.ec2SdkService.listIpAddresses(elasticIpClient)
      
            if (elasticIpAddresses && elasticIpAddresses.length) {
              for (let i = 0; i < elasticIpAddresses.length; i++) {
                const address=elasticIpAddresses[i]
                const ipAddress: ElasticIpProps = {
                    elasticIPName: address.Tags?.find(({Key})=>Key==='Name')?.Value||null,
                    location: address.NetworkBorderGroup,
                    ipAddress: address.PublicIp,
                    instanceId: address?.InstanceId,
                    networkInterfaceId: address?.NetworkInterfaceId,
                    associationId: address?.AssociationId,
                    publicIpv4Pool: address?.PublicIpv4Pool,
                    accountId: accountId,
                    allocationId: address?.AllocationId,
                    currencyCode: currencyCode,
                    isActive: 1,
                  };
                const doesIpExist = await this.elasticIpRepository.findIpAddress(ipAddress)
                if (doesIpExist) {
                  await this.elasticIpRepository.updateIpAddress(doesIpExist.id,ipAddress)
                } else {
                  await this.elasticIpRepository.addIpAddress(ipAddress);
                }
              }
            }
            this.logger.log(
              `Elastic Ip details job Completed for account: ${data.accountId} region: ${data.region}`,
            );
          } catch (error) {
            this.logger.log(
              `Error in getting Elastic Ip Details for account: ${data.accountId} region: ${data.region}: Error: ${error}`,
            );
          }

    }
}
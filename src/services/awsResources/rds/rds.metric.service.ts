import { Injectable, Logger } from '@nestjs/common';
import { ClientCredentials } from 'src/common/interfaces/awsClient.interface';
import { AwsAccountRepository } from 'src/infra/repositories/AwsAccount.repository';
import { RdsDetailsRepository } from 'src/infra/repositories/rdsDetails.repositories';
import { ClientConfigurationService } from 'src/libs/aws-sdk/clientConfiguration.service';
import { AwsHelperService } from '../helper/helper.service';
import { RdsUtilizationRepository } from 'src/infra/repositories/rdsUtilizationRepository';
import { RDSInstanceProps } from 'src/common/interfaces/rds.interface';
import {
  CloudWatchClient,
  GetMetricStatisticsCommandOutput,
} from '@aws-sdk/client-cloudwatch';
import { AWS_NAME_SPACES } from 'src/common/constants/constants';

@Injectable()
export class RDSMetricService {
  private readonly logger = new Logger(RDSMetricService.name);
  constructor(
    private readonly awsAccountRepository: AwsAccountRepository,
    private readonly rdsDetailsRepository: RdsDetailsRepository,
    private readonly clientConfigurationService: ClientConfigurationService,
    private readonly awsHelperService: AwsHelperService,
    private readonly rdsUtilizationRepository: RdsUtilizationRepository,
  ) {}

  async syncRdsUtilizationData(
    accountId: string,
    startTime: Date,
    endTime: Date,
  ): Promise<void> {
    try {
      this.logger.log(
        `Rds utilization data syncing  started for: ${accountId}`,
      );
      const accountDetails =
        await this.awsAccountRepository.getAccountDetails(accountId);
      const activeRdsInstances =
        accountDetails &&
        (await this.rdsDetailsRepository.findAllActiveDBInstances({
          accountId,
        }));
      await Promise.all(
        activeRdsInstances.map(async (rdsInstance) => {
          let clientRequest: ClientCredentials = {
            accessKeyId: accountDetails.accessKeyId,
            secretAccessKey: accountDetails.secretAccessKeyId,
            accountId: accountId,
            region: rdsInstance.region,
          };
          const cloudWatchClient =
            await this.clientConfigurationService.getCloudWatchClient(
              clientRequest,
            );

          for (let i = 0; i < rdsInstance.dbinstanceidentifier.length; i++) {
            let {
              CPUUtilization,
              DatabaseConnections,
              ReadIOPS,
              WriteIOPS,
              NetworkReceiveThroughput,
              NetworkTransmitThroughput,
            } = await this.getRDSUtilizationData(
              cloudWatchClient,
              rdsInstance.dbinstanceidentifier[i],
              startTime,
              endTime,
            );
            let CPUUtilizationData = this.awsHelperService.mapUtilizationData(
              CPUUtilization,
              rdsInstance.dbinstanceidentifier[i],
              accountId,
              'CPUUtilization',
            );

            let DatabaseConnectionData =
              this.awsHelperService.mapUtilizationData(
                DatabaseConnections,
                rdsInstance.dbinstanceidentifier[i],
                accountId,
                'DatabaseConnections',
              );
            let WriteIOPSData = this.awsHelperService.mapUtilizationData(
              WriteIOPS,
              rdsInstance.dbinstanceidentifier[i],
              accountId,
              'WriteIOPS',
            );

            let ReadIOPSData = this.awsHelperService.mapUtilizationData(
              ReadIOPS,
              rdsInstance.dbinstanceidentifier[i],
              accountId,
              'ReadIOPS',
            );
            let NetworkReceiveThroughputData =
              this.awsHelperService.mapUtilizationData(
                NetworkReceiveThroughput,
                rdsInstance.dbinstanceidentifier[i],
                accountId,
                'NetworkReceiveThroughput',
              );
            let NetworkTransmitThroughputData =
              this.awsHelperService.mapUtilizationData(
                NetworkTransmitThroughput,
                rdsInstance.dbinstanceidentifier[i],
                accountId,
                'NetworkTransmitThroughput',
              );
            const dataToProcess = [
              { data: CPUUtilizationData, metricName: 'CPUUtilization' },
              {
                data: DatabaseConnectionData,
                metricName: 'DatabaseConnection',
              },
              { data: WriteIOPSData, metricName: 'WriteIOPS' },
              { data: ReadIOPSData, metricName: 'ReadIOPS' },
              {
                data: NetworkReceiveThroughputData,
                metricName: 'NetworkReceiveThroughput',
              },
              {
                data: NetworkTransmitThroughputData,
                metricName: 'NetworkTransmitThroughput',
              },
            ];
            for (const { data, metricName } of dataToProcess) {
              if (data.length) {
                await this.rdsUtilizationRepository.deleteDuplicateUtilizationData(
                  {
                    accountId: accountId,
                    dbInstanceIdentifier: rdsInstance.dbinstanceidentifier[i],
                    metricName: metricName,
                    startTime,
                    endTime,
                  },
                );
                await this.rdsUtilizationRepository.addUtilizationData(data);
              }
            }
            let avgReadIOPS = ReadIOPS.map(({ Average }) => Average);
            let avgWriteIOPS = WriteIOPS.map(({ Average }) => Average);
            let avgDBConnections = DatabaseConnections.map(
              ({ Average }) => Average,
            );
            const dbInstanceFields: RDSInstanceProps = {
              accountId: accountId,
              dbInstanceIdentifier: rdsInstance.dbinstanceidentifier[i],
              readIOPSAvgMax: Math.max(...avgReadIOPS) || 0,
              writeIOPSAvgMax: Math.max(...avgWriteIOPS) || 0,
              dbConnectionsAvgMax: Math.max(...avgDBConnections) || 0,
            };
            await this.rdsDetailsRepository.updateDBInstanceByIdentifier(
              {
                dbInstanceIdentifier: rdsInstance.dbinstanceidentifier[i],
                accountId,
                region: rdsInstance.region,
              },
              dbInstanceFields,
            );
          }
        }),
      );
      this.logger.log(
        `Rds utilization data syncing  completed for: ${accountId}`,
      );
    } catch (error) {
      this.logger.log(
        `Error while fetching Rds Utilization Data for: ${accountId} error: ${error.message}`,
      );
    }
  }

  async getRDSUtilizationData(
    client: CloudWatchClient,
    InstanceName: string,
    startDate: Date,
    endDate: Date,
  ): Promise<{
    CPUUtilization: GetMetricStatisticsCommandOutput['Datapoints'];
    DatabaseConnections: GetMetricStatisticsCommandOutput['Datapoints'];
    ReadIOPS: GetMetricStatisticsCommandOutput['Datapoints'];
    WriteIOPS: GetMetricStatisticsCommandOutput['Datapoints'];
    NetworkReceiveThroughput: GetMetricStatisticsCommandOutput['Datapoints'];
    NetworkTransmitThroughput: GetMetricStatisticsCommandOutput['Datapoints'];
  }> {
    try {
      const metricNames = [
        'CPUUtilization',
        'DatabaseConnections',
        'ReadIOPS',
        'WriteIOPS',
        'NetworkReceiveThroughput',
        'NetworkTransmitThroughput',
      ];
      const metricDataPromises = metricNames.map((metricName: string) => {
        return this.awsHelperService.getMetricsData(
          {
            Namespace: AWS_NAME_SPACES.RDS,
            MetricName: metricName,
            Dimensions: [
              { Name: 'DBInstanceIdentifier', Value: `${InstanceName}` },
            ],
            StartTime: startDate,
            EndTime: endDate,
            Period: 60,
            Statistics: ['Average', 'Minimum', 'Maximum'],
            Unit:
              metricName === 'CPUUtilization'
                ? 'Percent'
                : metricName === 'DatabaseConnections'
                  ? 'Count'
                  : metricName === 'ReadIOPS' || metricName === 'WriteIOPS'
                    ? 'Count/Second'
                    : 'Bytes/Second',
          },
          client,
        );
      });
      const [
        CPUUtilization,
        DatabaseConnections,
        ReadIOPS,
        WriteIOPS,
        NetworkReceiveThroughput,
        NetworkTransmitThroughput,
      ] = await Promise.all(metricDataPromises);

      return {
        CPUUtilization,
        DatabaseConnections,
        ReadIOPS,
        WriteIOPS,
        NetworkReceiveThroughput,
        NetworkTransmitThroughput,
      };
    } catch (error) {
      this.logger.log('Error fetching RDS Utilization data', error.message);
    }
  }
}

import { Module } from "@nestjs/common";
import { RepositoriesModule } from "src/infra/repositories/repositories.module";
import { AwsSdkModule } from "src/libs/aws-sdk/aws-sdk.module";
import { SQSService } from "./sqs.service";
import { AwsHelperModule } from "../helper/helper.module";

@Module({imports:[RepositoriesModule,AwsSdkModule,AwsHelperModule],
providers:[SQSService],
exports:[SQSService]})
export class SQSModule{}
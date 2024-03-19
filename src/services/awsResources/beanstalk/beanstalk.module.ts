import { Module } from "@nestjs/common";
import { ElasticBeanStalkService } from "./beanstalk.service";
import { AwsHelperModule } from "../helper/helper.module";
import { AwsSdkModule } from "src/libs/aws-sdk/aws-sdk.module";
import { RepositoriesModule } from "src/infra/repositories/repositories.module";

@Module({imports:[AwsHelperModule,AwsSdkModule,RepositoriesModule],
providers:[ElasticBeanStalkService],
exports:[ElasticBeanStalkService]})

export class ElasticBeanStalkModule{}
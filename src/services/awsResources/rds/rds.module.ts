import { Module } from "@nestjs/common";
import e from "express";
import { RdsService } from "./rds.service";
import { AwsSdkModule } from "src/libs/aws-sdk/aws-sdk.module";
import { RepositoriesModule } from "src/infra/repositories/repositories.module";
import { AwsHelperModule } from "../helper/helper.module";

@Module({
    imports: [RepositoriesModule, AwsSdkModule, AwsHelperModule,],
    providers: [RdsService],
    exports: [RdsService],
  })

export class RdsModule{}
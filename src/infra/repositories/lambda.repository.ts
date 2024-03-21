import { Injectable } from "@nestjs/common";
import { BaseRepository } from "./base.repository";
import { InjectRepository } from "@nestjs/typeorm";
import { LambdaDetailsEntity } from "../entities/lambdaDetails.entity";
import { Repository } from "typeorm";

@Injectable()
export class LambdaDetailsRepository extends BaseRepository<LambdaDetailsEntity,number>{
    constructor(@InjectRepository(LambdaDetailsEntity)
    private readonly lambdaDetailsRepository:Repository<LambdaDetailsEntity>){super(lambdaDetailsRepository)}
}
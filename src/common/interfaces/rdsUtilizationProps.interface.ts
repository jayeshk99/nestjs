export interface RdsUtilizationProps{
    id?:number
    accountId:string
    dbInstanceIdentifier:string
    timestamp?:Date
    average?:number
    minimum?:number
    maximum?:number
    unit?:string
    metricName:string
    createdAt?:Date
    updatedAt?:Date
}
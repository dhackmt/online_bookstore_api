import { Request } from "express";

export interface IOrderServices{
    createCustomer(requestObject:Request):Promise<any>;
}
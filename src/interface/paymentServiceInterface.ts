import { Request } from "express";

export interface IPaymentService{
    createPayment(requestObject:Request):Promise<any>;    
}

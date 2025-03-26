import { injectable } from "inversify";
import { Request } from "express";
import { generateErrorResponse, generateSuccessResponse } from "../utils/responseUtil";
import GoCardless from "../common/goCardlessSetUp";
import { cli } from "winston/lib/winston/config";
import { IPaymentService } from "../interface/paymentServiceInterface";
import { request } from "http";
import Payment from "../models/paymentModel";
import {v4 as uuidv4} from "uuid";

interface APIResponse<T>{
    data:T;
    message:string;
    statusCode:number;
    success:boolean
}


@injectable()
class PaymentServices implements IPaymentService{  
 createPayment=async(requestObject: Request): Promise<any>=> {
     try
     {
        const client=new GoCardless().getClient();
        const mandateId=requestObject.params.mandateId;
        const orderId=requestObject.params.orderId;
        const amount:number=Number(requestObject.query.amount);
        const currency=requestObject.query.currency;
        
        const payment=await client.payments.create({
            "amount":amount,
            "currency":currency,
            "links":{
                "mandate":mandateId
            }
        });
        const paymentId=uuidv4();
        console.log(payment.id);
        const paymentRecord=await Payment.create({
            id:paymentId,
            amount:amount,
            orderId:orderId,
            goCardlessPaymentId:payment.id
        })


        return await generateSuccessResponse("Payment Created!");
     }
     catch(error:any)
     {
        return await generateErrorResponse(500,error);
     }
 }
}

export default PaymentServices;
import { injectable } from "inversify";
import orderService from "../services/orderServices";
import { Request, Response } from "express";
import PaymentService from "../services/paymentServices";

@injectable()
class PaymentController{
    public paymentService;
    constructor(paymentService:PaymentService){
        this.paymentService=paymentService;
    }

    createPayment=async(req:Request,res:Response)=>{
          try{  
            const result=await this.paymentService.createPayment(req);
            res.status(200).send(result);}
            catch(error:any)
            {
                res.status(500).send(error.message);
            }
    }
}

export default PaymentController;
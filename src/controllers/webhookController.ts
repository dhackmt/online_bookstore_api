import { Request, Response } from "express";
import dotenv from "dotenv";
import crypto from 'crypto';
import Payment from "../models/paymentModel";

dotenv.config();
class WebhookController
{
    async handleWebhook(req:Request,res:Response){
        console.log("Webhook received",req.body);
        
        const secret=process.env.GOCARDLESS_WEBHOOK_SECRET;
        if(!secret)
        {
            res.status(500).json({messsage:"NO secret"});
            return
        }

        const webhookSignature=req.headers["webhook-signature"] as string;
        if(!webhookSignature)
        {
            res.status(401).json({message:"Unauthorized no signature found"});
            return
        }

        const expectedSignature=crypto.createHmac("sha256",secret).update(JSON.stringify(req.body)).digest("hex");

        if(webhookSignature!==expectedSignature)
        {
            res.status(401).json({message:"Signature does not match"});
            return
        }

        console.log("webhook received and verified",JSON.stringify(req.body,null,2))

        for(const event of req.body.events)
        {
            const paymentId=event.links.payment || "unkown id";
            let payment;
            switch(event.action)
            {
                case "confirmed":
                    console.log("Payment confirmed ",paymentId);
                    payment=await Payment.update({status:"confirmed"},{where:{goCardlessPaymentId:paymentId}});                    
                    break;

                case "paid_out":
                    console.log("Payment paid out",paymentId);
                    payment=await Payment.update({status:"pai out"},{where:{goCardlessPaymentId:paymentId}});
                    break;
                
                case "failed":
                    console.log("Payment failed",paymentId);
                    payment=await Payment.update({status:"failed"},{where:{goCardlessPaymentId:paymentId}});
                    break;
                
                default:
                    console.log("unhandled event",event.links.payment);
            }   

        }


        res.status(200).json({message:"Webhook received successfully"});
    }
}

export default WebhookController;
import { injectable } from "inversify";
import { IOrderServices } from "../interface/orderServices";
import { Request } from "express";
import { generateErrorResponse, generateSuccessResponse } from "../utils/responseUtil";
import GoCardless from "../common/goCardlessSetUp";
import {v4 as uuidv4} from "uuid";
import Order from "../models/orderModel";
import Book from "../models/bookModel";

interface APIResponse<T>{
    data:T;
    message:string;
    statusCode:number;
    success:boolean
}


@injectable()
class OrderService implements IOrderServices{  
    createCustomer=async(requestObject: Request): Promise<APIResponse<string|null>>=> {
    try{
        const client=new GoCardless().getClient();
       const body=requestObject.body;
       
       const bookId=requestObject.params.bookId;

       const userId=(requestObject as any).user.id;

       if(!body.given_name || !body.family_name || !body.branchCode || !body.accountNumber || !body.email)
       {
        return await generateErrorResponse(400,"Invalid Parameters!");
       }
       const given_name=body.given_name;
       const family_name=body.family_name;
       const email=body.email;
       const amount=body.amount;
       const currency=body.currency;
       const customer=await client.customers.create({
        given_name,
        family_name,
        email,
        country_code:"GB"
       });
       const customerId=customer.id;
       if(!customerId)
       {
        return await generateErrorResponse(500,"Error in creating customer id");
       }

        const customerBankAccount=await client.customerBankAccounts.create({
            account_number: "55779911",
            branch_code: "200000",
            account_holder_name: "Frank Osborne",
            country_code: "GB",
            links: {
              "customer": customerId
            }
        });

       const bankAccountId=customerBankAccount.id;
       if(!bankAccountId)
       {
        return await generateErrorResponse(500,"Error getting bankAccountID");
       }

       const customerMandate=await client.mandates.create({
        scheme:"bacs",
        links:{
        "customer_bank_account": bankAccountId,
       
        }
       });
       const orderId=uuidv4();
       const order=await Order.create({
        id:orderId,
        bookId:bookId,
        userId:userId
       });

    
       const bookRecord=await Book.findByPk(bookId);
       const bookName=bookRecord?.dataValues.title;
       return await generateSuccessResponse(`Order Placed for ${bookName}!  http://localhost:3000/users/payment/${order.id}/${customerMandate.id}/query?amount=${encodeURIComponent(amount)}&currency=${encodeURIComponent(currency)}`);
    } 
    catch(error:any)
    {
        return await generateErrorResponse(500,error.message);
    }
    }
}

export default OrderService;
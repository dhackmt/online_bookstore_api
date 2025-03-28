import {SQSClient,SendMessageCommand} from "@aws-sdk/client-sqs";
import dotenv from 'dotenv';
import { injectable } from "inversify";
import { IAuthorService } from "../interface/authorServiceInterface";
import { Request } from "express";

dotenv.config();
@injectable()
class AuthorService implements IAuthorService{
     sendBookSubmissionMessage=async(requestObject:Request):Promise<any>=>{
        try{

            const bookData=requestObject.body;
              const sqsClient=new SQSClient({
                region:process.env.REGION,
            });
            
            const QUEUE_URL=process.env.AWS_SQS_URL;
            const params={
                QueueUrl:QUEUE_URL,
                MessageBody: JSON.stringify(bookData),
            };
    
            const command=new SendMessageCommand(params);
            await sqsClient.send(command);
            console.log("Message sent to sqs",bookData);
        }
        catch(error:any)
        {
            console.log("Error in sending book message",error.message);
        }
    }
}


export default AuthorService;
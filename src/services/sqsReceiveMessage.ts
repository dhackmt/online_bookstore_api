const { SQSClient, ReceiveMessageCommand, DeleteMessageCommand } = require("@aws-sdk/client-sqs");
const dotenv=require("dotenv")

dotenv.config();
const QUEUE_URL=process.env.AWS_SQS_URL
const sqsClient=new SQSClient({region:process.env.REGION})
async function processMessages(){
    while(true)
    {
        try{
            const command=new ReceiveMessageCommand({
                QueueUrl:QUEUE_URL,
                MaxNumberOfMessages:1,
                WaitTimeSeconds:10,
            });

            const response=await sqsClient.send(command);
            if(response.Messages && response.Messages.length>0)
            {
                for(const message of response.Messages)
                {
                    console.log("Received Message",message.Body);

                    const deleteCommand=new DeleteMessageCommand({
                        QueueUrl:QUEUE_URL,
                        ReceiptHandle:message.ReceiptHandle,
                    });

                    await sqsClient.send(deleteCommand);
                    console.log("Message deleted");
                }
            }
        }
        catch(error)
        {
                console.log(error);
        }
    }
}

processMessages();
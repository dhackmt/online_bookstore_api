import AWS from "aws-sdk";
import fs from "fs";
import path from "path";
import dotenv from "dotenv";
import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";


dotenv.config();

class SwaggerConfig{
    private s3Client;

    constructor(){
      this.s3Client=new S3Client({
        region:process.env.REGION,
        credentials:{
            accessKeyId:process.env.AWS_ACCESS_KEY || "",
            secretAccessKey:process.env.AWS_SECRET_KEY || ""
        }
      })
    }

    uploadSwaggerFile=async ():Promise<void>=>{
        const filePath=path.resolve(__dirname,"../../swagger.yaml");
        const fileContent=fs.readFileSync(filePath);
        const params={
            Bucket:process.env.S3_BUCKETName || "",
            Key:`swagger/${process.env.SWAGGER_FILENAME}`,
            Body:fileContent,
            ContentType:"application/yaml"
        };

        try{
            const command=new PutObjectCommand(params);
            await this.s3Client.send(command);
            console.log("Swagger uploaded successfully");
        }
        catch(error:any)
        {   
            console.log("Error uploading swagger");
        }
    }

}

export default SwaggerConfig;
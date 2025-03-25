import dotenv from 'dotenv';
import { GetObjectCommand, S3Client } from '@aws-sdk/client-s3';
import AWS from "aws-sdk";
import YAML from "yamljs"
dotenv.config();


class Swagger{
    private S3Client;
    private swaggerDocument:any|null=null;
    constructor()
    {
        this.S3Client=new S3Client({
            region:process.env.REGION,
            credentials:{
                secretAccessKey:process.env.AWS_SECRET_KEY || " ",
                accessKeyId:process.env.AWS_ACCESS_KEY || " ",
            }
        })
      
    }
    
    private async getSwaggerYamlFromS3():Promise<string | null>{
     try{
                const params=new GetObjectCommand({
                    Bucket:process.env.S3_BUCKETNAME || "",
                    Key:`swagger/${process.env.SWAGGER_FILENAME}`,
                })
                const data=await this.S3Client.send(params);
                if(!data.Body)
                {
                    console.log("Data is empty");
                }
                return data.Body?.transformToString('utf-8') ?? null;
    }
    catch(error){
        return "Error fetching swagger";
    }
    } 

    public async setUpSwagger():Promise<any>{
        const yamlContent=await this.getSwaggerYamlFromS3();
        if(!yamlContent)
        {
            console.log("failed to get swagger yaml from s3");
            return null;
        }
        this.swaggerDocument=YAML.parse(yamlContent);

        return this.swaggerDocument;
    }
}

export default Swagger;
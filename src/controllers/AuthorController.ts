import { injectable } from "inversify";
import AuthorService from "../services/sqsService";
import { Response,Request } from "express";

@injectable()
class AuthorController{
    private authorService;

    constructor(authorService:AuthorService){
        this.authorService=authorService
    }

    publishBook=async(req:Request,res:Response)=>{
        try{
            const result=await this.authorService.sendBookSubmissionMessage(req);
            res.status(200).json(result);
        }
        catch(error:any)
        {
            res.status(500).json(error.message);
        }
    }
}

export default AuthorController;
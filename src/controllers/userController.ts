import { Request,Response } from "express";
import { injectable } from "inversify";
import IUserService from "../interface/userServiceInterface";

@injectable()
class UserController
{
    constructor(private readonly userService:IUserService){}
    addUser=async(req:Request,res:Response):Promise<any>=>{
        try{
               const result:any=await this.userService.addUser(req);
               res.status(200).json(result);
        }
        catch(error)
        {
            res.status(500).json({message:"Error in adding user to database"});
        }
    }

    loginUser=async(req:Request,res:Response):Promise<any>=>{
        try{
                const result=await this.userService.loginUser(req);
                res.status(200).json(result);
        }
        catch(error)
        {
            res.status(500).json({message:"Error in loging user in"});
        }
    }
}

export default UserController;
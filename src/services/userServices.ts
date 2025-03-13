import { injectable } from "inversify";
import IUserService from "../interface/userServiceInterface";
import User from "../models/userModel";
import {v4 as uuidv4} from "uuid";
import { createToken, verifyToken } from "../common/auth";

@injectable()
class UserService implements IUserService
{
    addUser=async(requestObject: any): Promise<any>=> {
        try{
            const {email,password}=requestObject.body;
            console.log(email,password);
            const id=uuidv4();
            console.log(`Id is ${id}`);
            const hashedPassword=await User.hashPassword(password);
            
            const existingUser=await User.findOne({where:{email}});
            if(existingUser)
            {
                return {message:"user already exists!"};
            }
            const user=await User.create({
                userId:id,
                email:email,
                password:hashedPassword
            });
            const token=await createToken(email,id,"user");
            return {message:`user created successfully ${user} here is your token ${token}`};
        }
        catch(error)
        {
            return error;
        }
    }

    loginUser=async(requestObject: any): Promise<any> =>{
        try{
            const {email,password}=requestObject.body;
            
            const existingUser=await User.findOne({where:{email:email}});
           
            if(!existingUser)
            {
                return {message:"No such user found"};
            }
            const token=await createToken(existingUser.email,existingUser.userId,"user");
            const storedPassword=existingUser.password;
            console.log(token);
            const hashedPassword=await User.comparePassword(password,storedPassword);
            if(!hashedPassword)
            {
                return {message:"Password does not match!"};
            }
            return {message:`Login successfull ${token}`};
        }
        catch(error)
        {
            return {message:"Error in loging user in"};
        }
    }
}

export default UserService;
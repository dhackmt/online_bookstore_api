import jwt from "jsonwebtoken";
import User from "../models/userModel";
import Admin from "../models/adminModel";

interface Payload {
  id: string;
  email: string;
  role: string;
}

const secret = "ABC";

export const createToken = async (email: string, id: string, role: string) => {
  try {
    let Model;
    if (role == "admin") {
      Model = Admin;
    } else {
      Model = User;
    }

    const user = await Model.findByPk(id);
    if (!user) {
      return { message: "User not found" };
    }
    const payload: Payload = {
      id: user.id,
      email: user.email,
      role: role,
    };

    const token = jwt.sign(payload, secret);
    return token;
  } catch (error) {
    return { message: "User not found to create token" };
  }
};


export const verifyToken=(token:any)=>{
    try{
        const user:Payload=jwt.verify(token,secret) as Payload;
        return user;
    }
    catch(error)
    {
        return null;
    }
}

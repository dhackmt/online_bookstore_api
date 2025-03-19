import { injectable } from "inversify";
import IUserService from "../interface/userServiceInterface";
import User from "../models/userModel";
import {v4 as uuidv4} from "uuid";
import { createToken, verifyToken } from "../common/auth";
import Admin from "../models/adminModel";

@injectable()
class UserService implements IUserService {
  register = async (requestObject: any): Promise<any> => {
    try {
      const { email, password } = requestObject.body;
      const role = requestObject.baseUrl.includes("/admin") ? "admin" : "user";
      let Model;
      if (role == "admin") {
        Model = Admin;
      } else {
        Model = User;
      }

      return this.registerUser(Model, email, password, role);
    } catch (error) {
      return error;
    }
  };

  private async registerUser(
    Model: any,
    email: string,
    password: string,
    role: string
  ) {
    try {
      const id = uuidv4();
      const hashedPassword = await Model.hashPassword(password);
      let idField;
      const existingUser = await Model.findOne({ where: { email: email } });
      if (existingUser) {
        return { message: "User already exists!" };
      }

      const user = await Model.create({
        id: id,
        email: email,
        password: hashedPassword,
      });
      const token = await createToken(email, id, role);
      return {
        message: `user created successfully ${user} here is your token ${token}`,
      };
    } catch (error) {
      return error;
    }
  }

  login = async (requestObject: any): Promise<any> => {
    try {
      const { email, password } = requestObject.body;
      console.log(requestObject.baseUrl);
      const role = requestObject.baseUrl.includes("/admin") ? "admin" : "user";
      let Model;

      if (role == "admin") {
        Model = Admin;
      } else {
        Model = User;
      }
      return this.loginUser(Model, email, password, role);
    } catch (error) {
      return { message: "Error in loging user in" };
    }
  };

  private async loginUser(
    Model: any,
    email: string,
    password: string,
    role: string
  ) {
    try {
      const existingUser = await Model.findOne({ where: { email: email } });
      if (!existingUser) {
        return { message: "User does not exists" };
      }
      const hashedPassword = await Model.comparePassword(
        password,
        existingUser.password
      );
      if (!hashedPassword) {
        return { message: "Password does not match" };
      }

      const token = await createToken(email, existingUser.id, role);

      return { message: `login successfull ${token}` };
    } catch (error) {
      return error;
    }
  }
}

export default UserService;
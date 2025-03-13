import { injectable } from "inversify";
import { Request,Response,Router } from "express";
import UserController from "../controllers/userController";

class userRoute{
    private readonly router:Router;
    private readonly userController: UserController;

    constructor(userController:UserController){
        this.router=Router();
        this.userController=userController;
        this.configureRoutes();
    }

    configureRoutes(){
        this.router.post("/register", (req: Request, res: Response) =>
          this.userController.register(req, res)
        );
        this.router.post("/login", (req: Request, res: Response) =>
          this.userController.login(req, res)
        );
    }

    getRouter():Router{
        return this.router;
    }
}

export {userRoute}
import { Request, Router,Response } from "express";
import AuthorController from "../controllers/AuthorController";

class AuthorRoute{
    private authorController;
    private router:Router;

    constructor(authorController:AuthorController)
    {
        this.authorController=authorController,
        this.router=Router();
        this.configureRoutes();
    }

    configureRoutes()
    {
        this.router.post("/publish",(req:Request,res:Response)=>this.authorController.publishBook(req,res));
    }

    getRouter():Router
    {
        return this.router;
    }
}

export default AuthorRoute;
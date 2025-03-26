import { Response, Router,Request } from "express";
import WebhookController from "../controllers/webhookController";

class WebhookRoute
{
    private webhookController;
    private router:Router;
    constructor(webhookController:WebhookController){
        this.webhookController=webhookController;
        this.router=Router();
        this.configureRoutes();
    }
    
    configureRoutes()
    {
        this.router.post("/webhook",(req:Request,res:Response)=>this.webhookController.handleWebhook(req,res));
    }

    getRouter():Router{
       return this.router;
    }
}
export default WebhookRoute;
import { Request, Response, Router } from "express";
import PaymentController from "../controllers/paymnetController";
import { authMiddleware } from "../common/authMiddleware";


class PaymentRoute{
    public paymentController;
    private router:Router
    constructor(paymentController:PaymentController){
        this.paymentController=paymentController;
        this.router=Router();
        this.configureRoutes();
    }

    configureRoutes()
    {
        this.router.post("/payment/:orderId/:mandateId/query",authMiddleware(["user"]),(req:Request,res:Response)=>this.paymentController.createPayment(req,res));
    }

    getRouter():Router
    {
        return this.router;
    }
}
export default PaymentRoute;
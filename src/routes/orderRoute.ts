import { Request, Response, Router } from "express";
import orderController from "../controllers/orderController";
import { authMiddleware } from "../common/authMiddleware";

class OrderRoute{
    public orderController;
    private router:Router
    constructor(orderController:orderController){
        this.orderController=orderController;
        this.router=Router();
        this.configureRoutes();
    }

    configureRoutes()
    {
        this.router.post("/order/:bookId",authMiddleware(["user"]),(req:Request,res:Response)=>this.orderController.createCustomer(req,res));
    }

    getRouter():Router
    {
        return this.router;
    }
}
export default OrderRoute;
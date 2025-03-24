import { authMiddleware } from "../common/authMiddleware";
import ReviewController from "../controllers/reviewController";
import {Request,Response,Router} from "express";

class ReviewRoute{
    private reviewController;
    private readonly router:Router;
    constructor(reviewController:ReviewController)
    {
        this.reviewController=reviewController;
        this.router=Router();
        this.configureRoutes();
    }
    configureRoutes(){
       this.router.post("/books/:bookId/reviews",authMiddleware(["user"]), (req: Request, res: Response) =>
          this.reviewController.addReviews(req, res)
        );
        this.router.get("/books/:bookId/reviews",authMiddleware(["user","admin"]),(req:Request,res:Response)=>this.reviewController.getReviews(req,res));
        this.router.delete("/reviews/:id",authMiddleware(["admin"]),(req:Request,res:Response)=>this.reviewController.deleteReviews(req,res));
    }   

    getRouter():Router{
        return this.router;
    }
}

export {ReviewRoute};
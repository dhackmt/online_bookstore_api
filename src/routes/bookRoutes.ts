import { authMiddleware } from "../common/authMiddleware";
import BookController from "../controllers/bookController";
import {Request,Response,Router} from "express";

class BookRoute{
    private bookController;
    private readonly router:Router;
    constructor(bookController:BookController)
    {
        this.bookController=bookController;
        this.router=Router();
        this.configureRoutes();
    }
    configureRoutes(){
        this.router.get(
          "/books",
          authMiddleware(["admin", "user"]),
          (req: Request, res: Response) =>
            this.bookController.getBooks(req, res)
        );
        this.router.get(
          "/books/:id",
          authMiddleware(["admin", "user"]),
          (req: Request, res: Response) =>
            this.bookController.getBooksById(req, res)
        );
        this.router.post(
          "/books",
          authMiddleware(["admin"]),
          (req: Request, res: Response) =>
            this.bookController.addBooks(req, res)
        );
        this.router.put(
          "/books/:id",
          authMiddleware(["admin"]),
          (req: Request, res: Response) =>
            this.bookController.updateBooks(req, res)
        );
        this.router.delete(
          "/book/:id",
          authMiddleware(["admin"]),
          (req: Request, res: Response) =>
            this.bookController.deleteBook(req, res)
        );
    }

    getRouter():Router{
        return this.router;
    }
}

export {BookRoute};
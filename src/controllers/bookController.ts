import { injectable } from "inversify";
import BookService from "../services/bookService";
import { Request,Response } from "express";
import { Logger } from "../common/logger";

@injectable()
class BookController {
  private bookService;
  private logger = new Logger();

  constructor(bookService: BookService) {
    this.bookService = bookService;
  }

  getBooks = async (req: Request, res: Response) => {
    try {
      const result = await this.bookService.getBooks(req);
      await this.logger.info({message:"Data sent to services"});
      res.status(200).send(result);
    } catch (error: any) {
      await this.logger.error(error.message);
      res.status(500).send(error);
    }
  };

  getBooksById = async (req: Request, res: Response) => {
    try {
      const result = await this.bookService.getBookById(req);
      res.status(200).send(result);
    } catch (error) {
      res.status(500).send(error);
    }
  };

  addBooks = async (req: Request, res: Response) => {
    try {
      const result = await this.bookService.addBooks(req);
      res.status(200).send(result);
    } catch (error) {
      res.status(500).send(error);
    }
  };

  updateBooks = async (req: Request, res: Response) => {
    try {
      const result = await this.bookService.updateBook(req);
      res.status(200).send(result);
    } catch (error) {
      res.status(500).send(error);
    }
  };

  deleteBook = async (req: Request, res: Response) => {
    try {
      const result = await this.bookService.deleteBook(req);
      res.status(200).send(result);
    } catch (error) {
      res.send(500).send(error);
    }
  };
}

export default BookController;
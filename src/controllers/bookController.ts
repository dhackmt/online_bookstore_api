import { injectable } from "inversify";
import BookService from "../services/bookService";
import { Request,Response } from "express";


@injectable()
class BookController {
  private bookService;

  constructor(bookService: BookService) {
    this.bookService = bookService;
  }

  getBooks = async (req: Request, res: Response) => {
    try {
      const result = await this.bookService.getBooks(req);
      res.status(result.statusCode).send(result);
    } catch (error) {
      res.status(500).send(error);
    }
  };

  getBooksById = async (req: Request, res: Response) => {
    try {
      const result = await this.bookService.getBookById(req);
      res.status(result.statusCode).send(result);
    } catch (error) {
      res.status(500).send(error);
    }
  };

  addBooks = async (req: Request, res: Response) => {
    try {
      const result = await this.bookService.addBooks(req);
      res.status(result.statusCode).send(result);
    } catch (error) {
      res.status(500).send(error);
    }
  };

  updateBooks = async (req: Request, res: Response) => {
    try {
      const result = await this.bookService.updateBook(req);
      res.status(result.statusCode).send(result);
    } catch (error) {
      res.status(500).send(error);
    }
  };

  deleteBook = async (req: Request, res: Response) => {
    try {
      const result = await this.bookService.deleteBook(req);
      res.status(result.statusCode).send(result);
    } catch (error) {
      res.send(500).send(error);
    }
  };
}

export default BookController;
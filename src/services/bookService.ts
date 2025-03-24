import { injectable } from "inversify";
import { IBookService } from "../interface/bookServiceInterface";
import { Request } from "express";
import { fetchBookFromAPI } from "../utils/fetchBookFromAPI";
import {
  addToDB,
  deleteRecord,
  getAllBooks,
  getBookById,
  replaceAsync,
} from "../database/databaseServices";
import { v4 as uuidv4 } from "uuid";
import BookDTO from "../dto/BookDTO";
import {
  generateErrorResponse,
  generateSuccessResponse,
} from "../utils/responseUtil";
import Book from "../models/bookModel";

interface APIResponse<T> {
  data: T;
  message: string;
  statusCode: number;
  success: boolean;
}

@injectable()
class BookService implements IBookService {
  getBooks = async (
    requestObject: Request
  ): Promise<APIResponse<BookDTO[] | string | null>> => {
    try {
      const books: any = await getAllBooks();

      if (books.length == 0) {
        return await generateSuccessResponse("No data found");
      }
      const responseData = books.map((book: any) => {
        return new BookDTO(book);
      });

      return await generateSuccessResponse(responseData);
    } catch (error: any) {
      return await generateErrorResponse(500, error.message);
    }
  };

  addBooks = async (
    requestObject: Request
  ): Promise<APIResponse<BookDTO | string | null>> => {
    try {
      const body = requestObject.body;

      if (!body.price || !body.authors || !body.bookCode || !body.title) {
        return await generateErrorResponse(400, "Invalid parameters");
      }

      const bookId = uuidv4();

      const externalBookData = await fetchBookFromAPI(body.title);

      const date = externalBookData?.volumeInfo.publishedDate;

      const publishedYear = externalBookData
        ? parseInt(date.split("-")[0])
        : new Date().getFullYear();
      const description = externalBookData
        ? externalBookData.volumeInfo.description
        : "no description for this book";

      const bookData = {
        id: bookId,
        uuid: bookId,
        bookCode: body.bookCode,
        title: body.title,
        description: description,
        publishedYear: publishedYear,
        price: body.price,
        authors: body.authors,
        externalId: externalBookData.id,
      };
      const data = await addToDB(bookData, Book);
      const response = new BookDTO(data);
      if (!data) {
        return await generateErrorResponse(500, "Data not added to DB");
      }
      return await generateSuccessResponse(response);
    } catch (error: any) {
      return await generateErrorResponse(500, error.message);
    }
  };

  getBookById = async (
    requestObject: Request
  ): Promise<APIResponse<BookDTO | string | null>> => {
    try {
      if (!requestObject.params.id) {
        return await generateErrorResponse(
          400,
          "Invalid Parameters! Id required"
        );
      }
      const id = requestObject.params.id;

      const data = await getBookById(id);

      const response = new BookDTO(data);

      return await generateSuccessResponse(response);
    } catch (error: any) {
      return await generateErrorResponse(500, error.message);
    }
  };

  updateBook = async (
    requestObject: Request
  ): Promise<APIResponse<BookDTO | string | null>> => {
    try {
      if (!requestObject.params.id || !requestObject.body.price) {
        return await generateErrorResponse(
          400,
          "Invalid Parameters! Id and price required"
        );
      }
      const id = requestObject.params.id;
      const price = requestObject.body.price;

      const updateRecord = await replaceAsync(id, price, Book);

      const response = new BookDTO(updateRecord);
      return await generateSuccessResponse(response);
    } catch (error: any) {
      return await generateErrorResponse(500, error.message);
    }
  };

  deleteBook = async (
    requestObject: Request
  ): Promise<APIResponse<BookDTO | string | null>> => {
    try {
      if (!requestObject.params.id) {
        return await generateErrorResponse(
          400,
          "Invalid Parameters! Id required"
        );
      }
      const id = requestObject.params.id;
      const deleteBookRecord = await deleteRecord(id, Book);
      return await generateSuccessResponse("Record deleted!");
    } catch (error: any) {
      return await generateErrorResponse(500, error.message);
    }
  };
}

export default BookService;
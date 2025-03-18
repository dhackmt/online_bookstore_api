import { Request } from "express";

export interface IBookService{
    getBooks(requestObject:Request):Promise<any>;
    getBookById(requestObject:Request):Promise<any>;
    addBooks(requestObject:Request):Promise<any>;
    updateBook(requestObject:Request):Promise<any>;
    deleteBook(requestObject:Request):Promise<any>;
}
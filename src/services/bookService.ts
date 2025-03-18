import { injectable } from "inversify";
import { IBookService } from "../interface/bookServiceInterface";
import { Request } from "express";
import { fetchBookFromAPI } from "../utils/fetchBookFromAPI";
import { addBooksToDB, deleteBook, getAllBooks,getBookById, replaceAsync } from "../database/databaseServices";
import { v4 as uuidv4 } from "uuid";
import BookDTO from "../dto/BookDTO";

@injectable()
class BookService implements IBookService
{
    getBooks=async(requestObject: Request): Promise<any>=>{
        try{
                const books:any=await getAllBooks();
                console.log(books);

                if(books.length==0)
                {
                    return `No records found`;
                }
                const responseData=books.map((book:any)=>{
                    return new BookDTO(book);
                });
                
                console.log(responseData);
                return responseData;

        }
        catch(error)
        {
            return error;
        }
    }

    addBooks=async(requestObject: Request): Promise<any>=>{
        try
        {
            const body=requestObject.body;
            const bookId=uuidv4();
            
            const externalBookData=await fetchBookFromAPI(body.title);
      
            const date=externalBookData?.volumeInfo.publishedDate;
            console.log(date.split("-")[0]);
            const publishedYear=externalBookData? parseInt(date.split("-")[0]) : new Date().getFullYear();
            const description=externalBookData ? externalBookData.volumeInfo.description : "no description for this book" ;

            const bookData={
                id:bookId, 
                uuid:bookId,
                bookCode:body.bookCode, 
                title:body.title,
                description:description, 
                publishedYear:publishedYear,
                price:body.price,
                authors:body.authors,
                externalId:externalBookData.id
            }   
            const data=await addBooksToDB(bookData);
            console.log(data);
            if(!data)
            {
                return `error in adding book ${data}`;
            }
            return `Book added successfully ${JSON.stringify(data)}`;
        }
        catch(error)
        {
            return {message:`error in adding books to database ${error}`};
        }
    }

    getBookById=async(requestObject: Request): Promise<any>=> {
        try{
            if(!requestObject.params.id)
            {
                return `Book id required! missing parameteres`;
            }
            const id=requestObject.params.id;
            console.log(id);
            const data=await getBookById(id);
            const response=new BookDTO(data);
            return response;

        }
        catch(error)
        {
            return `error in fetching particular book ${error}`;
        }
    }

    updateBook=async(requestObject: Request): Promise<any>=> {
        try{
            if(!requestObject.params.id || !requestObject.body.price)
            {
                return `missing parameters required id and new price both`;
            }
            const id=requestObject.params.id;
            const price=requestObject.body.price;

            const updateRecord=await replaceAsync(id,price);
          
            const response=new BookDTO(updateRecord);
            return response;
        }
        catch(error)
        {
            return `error in updating book ${error}`;
        }
    }

    deleteBook=async(requestObject: Request): Promise<any>=> {
        try{
            if(!requestObject.params.id)
            {
                return "Missing parameters , id required!";
            }
            const id=requestObject.params.id;
            const deleteRecord=await deleteBook(id);
            console.log(deleteRecord);
            return "Book deleted Successfully!";
        }
        catch(error)
        {
            return `error in deleteing record ${error}`
        }
    }

}

export default BookService;
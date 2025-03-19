import Book from "../models/bookModel";
import {v4 as uuidv4} from "uuid";
export const addBooksToDB=async(bookData:any)=>{
    try{
        const data=await Book.create(bookData);
        return data;
    }
    catch(error)
    {
        return {message:`error in adding books to database ${error}`};
    }
}

export const getAllBooks=async()=>{
    try{
        const data=await Book.findAll({where:{archived:false,active:true}});
        return data;
    }
    catch(error)
    {
        return `error in gettting books from db ${error}`;
    }
}

export const getBookById=async(id:string)=>{
    try{
        const data=await Book.findByPk(id);
        return data?.dataValues;
    }
    catch(error)
    {
        return `error in getting book for ${id}`
    }
}

export const replaceAsync=async(id:string,price:number)=>{
    try{
        const existingData=await Book.findOne({where:{id:id,archived:false}});
        if(!existingData)
        {
            return `no such record exists , cannot update reocrd`;
        }
         const update=await Book.update({archived:true},{where:{id:id}});
         const updatedData={
            id:uuidv4(),
            uuid:existingData.uuid,
            bookCode:existingData.bookCode,
            title:existingData.title,
            description:existingData.description,
            publishedYear:existingData.publishedYear,
            price:price,
            authors:existingData.authors,
            externalId:existingData.externalId,
            active:true,
            archived:false,
            version:existingData.version + 1,
        }
        
         const updatedBook=await addBooksToDB(updatedData);
         return updatedBook;


    }
    catch(error)
    {
        return `error in updating book price`;
    }

}

//soft delete
export const deleteBook=async(id:string)=>{
    try{    
        const deletRecord=await Book.update({active:false,archived:true},{where:{id:id}});
        return deletRecord;
    }
    catch(error)
    {
        return `error in deleting book from db ${error}`;
    }
}
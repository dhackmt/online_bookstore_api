import axios from "axios";
import dotenv from "dotenv";
dotenv.config();

const BASE_URL=process.env.GOGGLE_BOOK_API;
export const fetchBookFromAPI=async(title:string)=>{
  try{
    const books=await axios.get(`${BASE_URL}?q=${title}`);

    return books.data.items[0];
  }
  catch(error)
  {
    return error;
  }
}
import Book from "../models/bookModel";
import {v4 as uuidv4} from "uuid";

export const addToDB = async (record: any, Model: any) => {
  try {
    const data = await Model.create(record);
    console.log(data);
    return data;
  } catch (error) {
    return { message: `error in adding books to database ${error}` };
  }
};

export const getAllBooks = async () => {
  try {
    const data = await Book.findAll({
      where: { archived: false, active: true },
    });
    return data;
  } catch (error) {
    return `error in gettting books from db ${error}`;
  }
};

export const getDataById = async (field: string, id: string, Model: any) => {
  try {
    const data = await Model.findAll({
      where: { [field]: id, active: true, archived: false },
    });
    return data;
  } catch (error) {
    return `error in getting book for ${id}`;
  }
};

export const getBookById = async (id: string) => {
  try {
    const data = await Book.findByPk(id);
    return data;
  } catch (error) {
    return `error in getting book by ${id}`;
  }
};

export const replaceAsync = async (id: string, price: number, Model: any) => {
  try {
    const existingData = await Model.findOne({
      where: { id: id, archived: false },
    });
    if (!existingData) {
      return `no such record exists , cannot update reocrd`;
    }
    const update = await Model.update(
      { archived: true },
      { where: { id: id } }
    );
    const updatedData = {
      id: uuidv4(),
      uuid: existingData.uuid,
      bookCode: existingData.bookCode,
      title: existingData.title,
      description: existingData.description,
      publishedYear: existingData.publishedYear,
      price: price,
      authors: existingData.authors,
      externalId: existingData.externalId,
      active: true,
      archived: false,
      version: existingData.version + 1,
    };

    const updatedBook = await addToDB(updatedData, Model);
    return updatedBook;
  } catch (error) {
    return `error in updating book price`;
  }
};

//soft delete
export const deleteRecord = async (id: string, Model: any) => {
  try {
    const getData = await getDataById("id", id, Model);
    if (getData.length == 0) {
      return " No Data to Delete";
    }
    const deletRecord = await Model.update(
      { active: false, archived: true },
      { where: { id: id } }
    );
    return deletRecord;
  } catch (error) {
    return `error in deleting book from db ${error}`;
  }
};



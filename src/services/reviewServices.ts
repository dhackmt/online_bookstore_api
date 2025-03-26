import { injectable } from "inversify";
import { IReviewService } from "../interface/reviewServiceInterface";
import Reviews from "../models/reviewModel";
import { Request } from "express";
import { v4 as uuidv4 } from "uuid";
import {
  generateErrorResponse,
  generateSuccessResponse,
} from "../utils/responseUtil";
import {
  addToDB,
  deleteRecord,
  getDataById,
} from "../database/databaseServices";
import ReviewDTO from "../dto/reviewDTO";

interface APIResponse<T> {
  data: T;
  message: string;
  statusCode: number;
  success: boolean;
}

@injectable()
class ReviewService implements IReviewService {
  getReviews = async (
    requestObject: Request
  ): Promise<APIResponse<ReviewDTO[] | string | null>> => {
    try {
      const bookId = requestObject.params.bookId;
      if (!bookId) {
        return await generateErrorResponse(500, "Book id not found");
      }

      const records = await getDataById("bookId", bookId, Reviews);
      if (records.length == 0) {
        return await generateSuccessResponse("NO reviews");
      }
      const response = records.map((data: any) => {
        const userId = data.dataValues.userId;
        const bookId = data.dataValues.bookId;
        const content = data.dataValues.content;
        const DtoResponse = new ReviewDTO({ userId, bookId, content });
        return DtoResponse;
      });
      return await generateSuccessResponse(response);
    } catch (error: any) {
      return await generateErrorResponse(500, error.message);
    }
  };

  addReviews = async (
    requestObject: Request
  ): Promise<APIResponse<ReviewDTO | null | string>> => {
    try {
      if (!requestObject.body.content || !requestObject.params.bookId) {
        return await generateErrorResponse(400, "Missing parameters!");
      }
      const userId = (requestObject as any).user.id;
      if (!userId) {
        return await generateErrorResponse(400, "user Id not found");
      }
      const content = requestObject.body.content;
      const bookId = requestObject.params.bookId;

      const id = uuidv4();

      const data = await addToDB({ id, bookId, userId, content }, Reviews);
      const response = new ReviewDTO(data);
      return await generateSuccessResponse(response);
    } catch (error: any) {
      return await generateErrorResponse(500, error.message);
    }
  };

  deleteReviews = async (
    requestObject: Request
  ): Promise<APIResponse<string | null>> => {
    try {
      if (!requestObject.params.id) {
        return await generateErrorResponse(400, "Missing parameters");
      }
      const bookId = requestObject.params.id;
      const deletedReview = await deleteRecord(bookId, Reviews);

      return await generateSuccessResponse(deletedReview);
    } catch (error: any) {
      return await generateErrorResponse(500, error.message);
    }
  };
}

export default ReviewService;
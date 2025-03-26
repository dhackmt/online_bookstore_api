import { Request } from "express";

export interface IReviewService {
  addReviews(requestObject: Request): Promise<any>;
  getReviews(requestObject: Request): Promise<any>;
  deleteReviews(requestObject:Request):Promise<any>;
}
import { Request } from "express";

export interface IReviewService{
    getReviews(requestObject:Request):Promise<any>;
}
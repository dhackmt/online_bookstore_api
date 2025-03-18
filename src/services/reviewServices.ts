import { injectable } from "inversify";
import { IReviewService } from "../interface/reviewServiceInterface";

@injectable()
class ReviewService implements IReviewService{
 getReviews=async():Promise<any>=>{
    try{

    }
    catch(error)
    {
        
    }
 }
}

export default ReviewService;
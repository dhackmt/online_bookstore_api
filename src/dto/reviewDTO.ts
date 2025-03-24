class ReviewDTO
{
    public bookId!:string;
    public userId!:string;
    public content!:string;
    public message!:string;

    constructor(Props:any)
    {
        this.message="Review Data:"
        this.bookId=Props.bookId;
        this.userId=Props.userId;
        this.content=Props.content;
    }
}
export default ReviewDTO;
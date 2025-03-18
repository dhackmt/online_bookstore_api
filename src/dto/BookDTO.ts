class BookDTO{
    public  id!:string;
    public uuid!:string;
    public  bookCode!:string;
    public title!:string;
    public description!:string;
    public publishedYear!:number;
    public price!:number;
    public authors!:string;
    public externalId!:string;
    public message!:string;

    constructor(props:any)
    {
        this.message="This is Book Data";
        this.id=props.id;
        this.uuid=props.uuid;
        this.bookCode=props.bookCode;
        this.title=props.title;
        this.description=props.description;
        this.publishedYear=props.publishedYear;
        this.price=props.price;
        this.authors=props.authors;
        this.externalId=props.externalId
    }
}

export default BookDTO;
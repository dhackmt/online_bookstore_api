export default interface IUserService{
    addUser(requestObject:any):Promise<any>;
    loginUser(requestObject:any):Promise<any>;
}
export default interface IUserService {
  register(requestObject: any): Promise<any>;
  login(requestObject: any): Promise<any>;
}
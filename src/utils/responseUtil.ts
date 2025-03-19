interface APIResponse<T>
{
    data:T;
    message:string;
    statusCode:number;
    success:boolean
}

export const generateSuccessResponse=async<T>(data:T,message="success"):Promise<APIResponse<T>>=>{
    return {
        message,
        statusCode:200,
        success:true,
        data
    }
}

export const generateErrorResponse=async<T>(statusCode:number,message="Error"):Promise<APIResponse<null>>=>{
    return{
        message,
        statusCode,
        success:false,
        data:null
    }
}
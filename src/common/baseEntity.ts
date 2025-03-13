import {v4 as uuidv4} from "uuid";

class BaseEntity{
    id:string | null =null;
    createdOn:string | null=null;
    updatedOn:string | null =null;
    expireAt: string | null =null;
    dType:string | null=null;
    version: number=0;
    active:boolean=true;
    archived:boolean=false;

    initialize(
        isNew:boolean,
        dType:string,
    ):void{
        this.dType=dType,
        this.id=uuidv4();
        this.active=true;
        this.archived=false;

        if(isNew)
        {
            this.createdOn=new Date().toISOString();
            this.version=1;
            this.updatedOn=this.createdOn;
            this.expireAt=new Date(new Date().setDate(new Date().getDate()+30)).toISOString();
        }
        else{
            this.updatedOn=new Date().toISOString();
            this.version++;
        }
    }
}

export function initialize(isNew:boolean,dType:string,object:any):any{
object.dType=dType;
object.id=uuidv4();
object.active=true;
object.archived=false;

if(isNew)
{
    object.createdOn=new Date().toISOString();
    object.version=1;
    object.updatedOn=object.createdOn;
}
else{
    object.updatedOn=new Date().toISOString();
    object.version++;
}
}

export default BaseEntity;
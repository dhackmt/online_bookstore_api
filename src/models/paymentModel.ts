import { Model,DataTypes } from "sequelize";
import sequelize from "../database/dbConfig";
class Payment extends Model
{
    public readonly id!:string;
    public readonly status!:string;
    public readonly amount!:number;
    public readonly orderId!:string;
    public readonly goCardlessPaymentId!:string;

}

Payment.init({
    id:{
        type:DataTypes.STRING,
        primaryKey:true
    },
    status:{
        type:DataTypes.STRING,
        allowNull:false,
        defaultValue:"pending"
    },
    amount:{
        type:DataTypes.INTEGER,
        allowNull:false
    },
    orderId:{
        type:DataTypes.STRING,
        allowNull:false
    },
    goCardlessPaymentId:{
        type:DataTypes.STRING,
    }
  
},{
    sequelize,
    tableName:"Payment",
    timestamps:true
})

export default Payment;
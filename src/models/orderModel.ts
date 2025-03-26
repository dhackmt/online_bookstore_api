import { Model,DataTypes } from "sequelize";
import sequelize from "../database/dbConfig";
import Book from "./bookModel";
import Payment from "./paymentModel";
class Order extends Model
{   
    public readonly id!:string;
    public readonly bookId!:string;
    public readonly userId!:string;
}

Order.init({
    id:{
        type:DataTypes.STRING,
        primaryKey:true
    },
    userId:{
        type:DataTypes.STRING,
        allowNull:false
    },
    bookId:{
        type:DataTypes.STRING,
        allowNull:false
    },
},{
sequelize,
tableName:"Order",
timestamps:true
});

Order.hasOne(Payment,{foreignKey: "orderId"});
Payment.belongsTo(Order,{foreignKey:"orderId"});


export default Order
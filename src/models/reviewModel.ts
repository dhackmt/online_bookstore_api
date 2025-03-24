import sequelize from '../database/dbConfig';
import {DataTypes,Model} from 'sequelize'
import Book from './bookModel';
import User from './userModel';


class Reviews extends Model
{
    public readonly id!:string;
    public readonly userId!:string;
    public readonly bookId!:string;
    public readonly content!:string;
}

Reviews.init({
    id:{
        type:DataTypes.STRING,
        primaryKey:true
    },
    userId:{
        type:DataTypes.STRING,
        allowNull:false,
    },
    bookId:{
        type:DataTypes.STRING,
        allowNull:false,
    },    
    content:{
        type:DataTypes.STRING,
        allowNull:false
    },
    active:{
        type:DataTypes.BOOLEAN,
        defaultValue:true
    },
    archived:{
        type:DataTypes.BOOLEAN,
        defaultValue:false
    }
},{
    sequelize,
    timestamps:true,
    tableName:"Review"
});

export default Reviews;



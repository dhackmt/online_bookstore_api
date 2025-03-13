import { DataTypes,Model } from "sequelize";
import sequelize from "../database/dbConfig";
import bcrypt from "bcrypt";

class User extends Model{
   public userId!:string;
   public email!:string;
   public password!:string;

   public static async hashPassword(password:string):Promise<string>{
    const saltRounds=10;
    console.log(saltRounds);
    const salt=await bcrypt.genSalt(saltRounds);
    console.log(salt);
    const hashed=await bcrypt.hash(password,salt);
    return hashed;
}

    public static async comparePassword(enteredPassword:string,storedPassword:string):Promise<boolean>{
    const hashedPassword= bcrypt.compare(enteredPassword,storedPassword);
    return hashedPassword;
    }

}

User.init({
    userId:{
        type:DataTypes.STRING,   
        primaryKey:true,
    },
    email:{
        type:DataTypes.STRING,
        allowNull:false,
        unique:true,
    },
    password:{
        type:DataTypes.STRING,
        allowNull:false
    }
},{
    sequelize,
    tableName:"Users",
    timestamps:true,
})

export default User;
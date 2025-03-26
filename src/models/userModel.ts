import { DataTypes,Model } from "sequelize";
import sequelize from "../database/dbConfig";
import bcrypt from "bcrypt";
import Order from "./orderModel";

class User extends Model {
  public id!: string;
  public email!: string;
  public password!: string;

  public static async hashPassword(password: string): Promise<string> {
    const saltRounds = 10;
    const salt = await bcrypt.genSalt(saltRounds);

    const hashed = await bcrypt.hash(password, salt);
    return hashed;
  }

  public static async comparePassword(
    enteredPassword: string,
    storedPassword: string
  ): Promise<boolean> {
    const hashedPassword = bcrypt.compare(enteredPassword, storedPassword);
    return hashedPassword;
  }
}

User.init(
  {
    id: {
      type: DataTypes.STRING,
      primaryKey: true,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    sequelize,
    tableName: "Users",
    timestamps: true,
  }
);

User.hasMany(Order, { foreignKey: "userId" });
Order.belongsTo(User, { foreignKey: "userId" });

export default User;
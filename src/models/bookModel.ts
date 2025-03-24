import sequelize from "../database/dbConfig";
import { Model,DataTypes } from "sequelize";
import Reviews from "./reviewModel";
import User from "./userModel";

class Book extends Model {
  public readonly id!: string;
  public readonly uuid!: string;
  public readonly bookCode!: string;
  public title!: string;
  public description!: string;
  public publishedYear!: number;
  public price!: number;
  public authors!: string;
  public externalId!: string;
  public active!: boolean;
  public archived!: boolean;
  public version!: number;
}

Book.init(
  {
    id: {
      type: DataTypes.STRING,
      primaryKey: true,
    },
    uuid: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    bookCode: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    publishedYear: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    price: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    authors: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    active: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
    archived: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    version: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1,
    },
    externalId: {
      type: DataTypes.STRING,
    },
  },
  {
    sequelize,
    timestamps: true,
    tableName: "Books",
  }
);

Book.hasMany(Reviews, {
  foreignKey: "bookId",
});

Reviews.belongsTo(Book, {
  foreignKey: "bookId",
});

User.hasMany(Reviews, {
  foreignKey: "userId",
});

Reviews.belongsTo(Reviews, {
  foreignKey: "userId",
});

export default Book;
import { Sequelize } from "sequelize";

const sequelize=new Sequelize({
    username:'postgres',
    host:'localhost',
    database:'books',
    password:'root',
    dialect:'postgres',
});

export default sequelize;
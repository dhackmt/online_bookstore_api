import { Sequelize } from "sequelize";
import fs from "fs";
const sequelize = new Sequelize({
  username: "postgres",
  // host: "host.docker.internal",  //this is for docker
  host: "localhost",
  database: "books",
  password: "root",
  dialect: "postgres",
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false,
    },
  },
  logging: console.log,
});

export default sequelize; 
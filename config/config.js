require("dotenv").config();
console.log({
  username: process.env.DATABASE_USERNAME,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABAES_NAME,
  host: process.env.DATABASE_HOST,
  dialect: "postgres",
  port: process.env.DATABASE_PORT,
});
module.exports = {
  development: {
    username: process.env.DATABASE_USERNAME,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABAES_NAME,
    host: process.env.DATABASE_HOST,
    dialect: "postgres",
    port: process.env.DATABASE_PORT,
  },
  test: {
    username: process.env.DATABASE_USERNAME,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.BATABAES_NAME,
    host: process.env.DATABASE_HOST,
    dialect: "postgres",
    port: process.env.DATABASE_PORT,
  },
  production: {
    username: process.env.DATABASE_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.BATABAES_NAME,
    host: process.env.DATABASE_HOST,
    dialect: "postgres",
    port: process.env.DATABASE_PORT,
  },
};

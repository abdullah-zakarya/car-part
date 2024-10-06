import { Sequelize } from "sequelize";

const sequelize = new Sequelize(
  process.env.DATABASENAME!,
  process.env.BATABAES_USERNAME!,
  process.env.DATABASE_PASSWORD!,
  {
    host: "localhost",
    dialect: "postgres",
    port: 4500,
  }
);

export default sequelize;

import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';

dotenv.config();

const sequelize = new Sequelize(
  process.env.DATABASE_NAME || 'car_part',
  process.env.DATABASE_USERNAME!,
  process.env.DATABASE_PASSWORD!,
  {
    host: 'localhost',
    dialect: 'postgres',
    port: Number(process.env.DATABASE_PORT)!,
    logging: false,
  }
);

export default sequelize;

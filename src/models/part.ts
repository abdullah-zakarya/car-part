import {
  Model,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
} from 'sequelize';
import sequelize from '../../config/database';
import User from './User';
import AppError from '../../utils/AppError';
class Part extends Model<InferAttributes<Part>, InferCreationAttributes<Part>> {
  declare id: CreationOptional<number>; // like 1
  declare owner: number;
  declare carType: string; // nesan
  declare category: string; // merorr
  declare brand: string; // brand of the part
  declare madeIn: string;
  declare year: Date;
  declare price: number;
  declare new: boolean;
  declare mainPhoto: string;
  declare photos: string[] | undefined;
  declare stock: number;
}

Part.init(
  {
    id: {
      type: DataTypes.INTEGER, // Use INTEGER instead of NUMBER
      unique: true,
      primaryKey: true,
      autoIncrement: true,
    },
    owner: {
      type: DataTypes.INTEGER,
    },
    carType: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    category: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    brand: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    madeIn: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    year: {
      type: DataTypes.DATE,
      allowNull: false,
      validate: {
        isReal(value: Date) {
          if (Number(value) > Date.now()) {
            throw new AppError('is this from the future !!', 403);
          }
          if (Number(value) < new Date(0).setFullYear(1950)) {
            throw new AppError('this part already dead');
          }
        },
      },
    },
    price: {
      type: DataTypes.DOUBLE,
      allowNull: false,
      validate: {
        isNumeric: {
          msg: 'the price must be number',
        },
      },
    },
    new: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
    },
    mainPhoto: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    photos: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      allowNull: true,
    },
    stock: {
      type: DataTypes.INTEGER,
      defaultValue: 1,
    },
  },
  {
    sequelize,
    modelName: 'Part',
    timestamps: true,
    indexes: [{ fields: ['carType', 'category'] }],
  }
);
export default Part;

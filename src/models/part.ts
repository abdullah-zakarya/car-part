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
interface IPart {
  id: number;
  owner: number;
  carType: string;
  category: string;
  brand: string;
  madeIn: string;
  year: Date;
  price: number;
  new: boolean;
  mainPhoto: string;
  photos: string[] | undefined;
  stock: number;
  country: string;
  city: string;
}
class Part
  extends Model<InferAttributes<Part>, InferCreationAttributes<Part>>
  implements IPart
{
  declare id: CreationOptional<number>;
  declare owner: number;
  declare carType: string;
  declare category: string;
  declare brand: string;
  declare madeIn: string;
  declare year: Date;
  declare price: number;
  declare new: boolean;
  declare mainPhoto: string;
  declare photos: string[] | undefined;
  declare stock: number;
  declare country: string;
  declare city: string;
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
    country: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    city: {
      type: DataTypes.STRING,
      allowNull: false,
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

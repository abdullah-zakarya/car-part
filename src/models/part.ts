import {
  Model,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
} from 'sequelize';
import sequelize from '../../config/database';
import User from './User';
class Part extends Model<InferAttributes<Part>, InferCreationAttributes<Part>> {
  declare id: CreationOptional<number>; // like 1
  declare owner: number;
  declare carType: string; // nesan
  declare category: string; // merorr
  declare brand: string; // brand of the part
  declare madeIn: Date;
  declare year: Date;
  declare price: number;
  declare new: boolean;
  declare mainPhoto: string;
  declare photos: string[] | undefined;
  declare postedAT: CreationOptional<Date>;
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
      type: DataTypes.DATE,
      allowNull: false,
    },
    year: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    price: {
      type: DataTypes.DOUBLE,
      allowNull: false,
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
    postedAT: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    stock: {
      type: DataTypes.INTEGER,
      defaultValue: 1,
    },
  },
  {
    sequelize,
    modelName: 'Part',
    timestamps: false,
    indexes: [{ fields: ['carType', 'partType'] }],
  }
);
export default Part;

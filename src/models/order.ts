import {
  InferCreationAttributes,
  InferAttributes,
  Model,
  DataTypes,
  CreationOptional,
} from 'sequelize';
import sequelize from '../../config/database';
class Order extends Model<
  InferAttributes<Order>,
  InferCreationAttributes<Order>
> {
  declare id: CreationOptional<number>;
  declare userId: number;
  declare sales: number[];
  declare price: number;
  declare shipment: number;
  declare total: number;
}

Order.init(
  {
    id: {
      type: DataTypes.INTEGER, // Use INTEGER instead of NUMBER
      unique: true,
      primaryKey: true,
      autoIncrement: true,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    sales: {
      type: DataTypes.ARRAY(DataTypes.INTEGER),
      allowNull: false,
    },
    price: {
      type: DataTypes.FLOAT,
      defaultValue: 1,
    },
    shipment: {
      type: DataTypes.INTEGER,
    },
    total: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
  },
  {
    sequelize,
    timestamps: true,
  }
);

export default Order;

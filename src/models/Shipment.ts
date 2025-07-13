import {
  InferCreationAttributes,
  InferAttributes,
  CreationOptional,
  Model,
  DataTypes,
} from 'sequelize';
import sequelize from '../../config/database';
import { shipmentState, Address } from '../../types/types';

class Shipment extends Model<
  InferAttributes<Shipment>,
  InferCreationAttributes<Shipment>
> {
  declare id: CreationOptional<number>;
  declare customerId: number;
  declare status: CreationOptional<shipmentState>;
  declare customerLocation: Address;
  declare sales: Number[];
  declare cost: Number;
}

Shipment.init(
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    customerId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    sales: {
      type: DataTypes.ARRAY(DataTypes.INTEGER),
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM(...Object.values(shipmentState)),
      allowNull: false,
    },
    customerLocation: {
      type: DataTypes.JSON,
    },
    cost: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
  },
  {
    sequelize,
    timestamps: true,
  }
);

export default Shipment;

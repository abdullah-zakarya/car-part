import {
  InferCreationAttributes,
  InferAttributes,
  CreationOptional,
  Model,
  DataTypes,
} from 'sequelize';
import sequelize from '../../config/database';
import { Point, shipmentState } from '../../types/types';

class Shipment extends Model<
  InferAttributes<Shipment>,
  InferCreationAttributes<Shipment>
> {
  declare id: CreationOptional<number>;
  declare customerId: number;
  declare shipmentType: string;
  declare status: shipmentState;
  declare paymentMethod: string;
  declare itemLocation: Point;
  declare customerLocation: Point;
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
    shipmentType: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    itemLocation: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM(...Object.values(shipmentState)),
      allowNull: false,
    },
    paymentMethod: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    customerLocation: {
      type: DataTypes.ARRAY(DataTypes.NUMBER),
    },
  },
  {
    sequelize,
    timestamps: true,
  }
);

export default Shipment;
// ---------------------------------------------------------------------------------------------------------------
// ---------------------------------------------------------------------------------------------------------------
// ------------------------------------------------------  --  --  ---------------------------------------------------
// ------------------------------------------------  --           --  ------------------------------------------------
// -------------------------------------------                        --  ------------------------------------------
// ---------------------------------------                               --  ---------------------------------------
// ------------------------------------                                       ------------------------------------
// ---------------------------------------                                 ---------------------------------------
// -------------------------------------------                          ------------------------------------------
// ------------------------------------------------               ------------------------------------------------
// ----------------------------------------------------      -----------------------------------------------------
// ---------------------------------------------------------------------------------------------------------------
// ---------------------------------------------------------------------------------------------------------------

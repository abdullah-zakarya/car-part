import {
  InferCreationAttributes,
  InferAttributes,
  CreationOptional,
  Model,
  DataTypes,
  Sequelize,
} from "sequelize";
import sequelize from "../../config/database";

enum ShipmentStatus {
  STOCK = "stock",
  SHIPPING = "shipping",
  DONE = "done",
}

class Sale extends Model<InferAttributes<Sale>, InferCreationAttributes<Sale>> {
  declare id: CreationOptional<number>;
  declare customerId: number;
  declare partId: number;
  declare shipment: string;
  declare status: ShipmentStatus;
  declare paymentMethod: string;
  declare createdAt: CreationOptional<Date>;
}

Sale.init(
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
    partId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    shipment: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM(...Object.values(ShipmentStatus)),
      allowNull: false,
    },
    paymentMethod: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    createdAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    sequelize,
    timestamps: true,
    indexes: [{ fields: ["customerId"] }, { fields: ["partId"] }],
  }
);

export default Sale;

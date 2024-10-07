import {
  InferCreationAttributes,
  InferAttributes,
  CreationOptional,
  Model,
  DataTypes,
} from "sequelize";
import sequelize from "../../config/database";

enum ServerStatus {
  inqueue = "inqueue",
  processing = "processing",
  done = "done",
}
class Server extends Model<
  InferAttributes<Server>,
  InferCreationAttributes<Server>
> {
  declare id: CreationOptional<number>;
  declare customerId: number;
  declare serverType: string;
  declare location: string;
  declare paymentMethod: string;
  declare createdAt: CreationOptional<Date>;
  declare status: ServerStatus;
}

Server.init(
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
    serverType: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    location: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM(...Object.values(ServerStatus)),
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
  }
);

export default Server;

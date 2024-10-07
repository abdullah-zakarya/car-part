import {
  InferCreationAttributes,
  InferAttributes,
  CreationOptional,
  Model,
  DataTypes,
} from "sequelize";
import sequelize from "../../config/database";

class Notifcation extends Model<
  InferAttributes<Notifcation>,
  InferCreationAttributes<Notifcation>
> {
  declare userId: number;
  declare text: string;
  declare readed: boolean;
}

Notifcation.init(
  {
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    text: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    readed: {
      type: DataTypes.BOOLEAN,
    },
  },
  {
    sequelize,
  }
);

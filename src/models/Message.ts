import {
  InferCreationAttributes,
  InferAttributes,
  CreationOptional,
  Model,
  DataTypes,
} from "sequelize";
import sequelize from "../../config/database";

class Notification extends Model<
  InferAttributes<Notification>,
  InferCreationAttributes<Notification>
> {
  declare senderId: number;
  declare receiverId: number;
  declare message: string;
  declare time: CreationOptional<Date>;
  declare isRead: CreationOptional<boolean>;
}

Notification.init(
  {
    senderId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    receiverId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    message: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    isRead: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    time: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    sequelize,
    indexes: [{ fields: ["senderId", "receiverId"] }, { fields: ["time"] }],
    timestamps: true,
  }
);

export default Notification;

import {
  InferCreationAttributes,
  InferAttributes,
  Model,
  DataTypes,
} from 'sequelize';
import sequelize from '../../config/database';

class Notification extends Model<
  InferAttributes<Notification>,
  InferCreationAttributes<Notification>
> {
  declare userId: number;
  declare text: string;
  declare readed: boolean;
}

Notification.init(
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

export default Notification;

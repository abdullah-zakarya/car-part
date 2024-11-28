import {
  InferCreationAttributes,
  InferAttributes,
  Model,
  DataTypes,
  CreationOptional,
} from 'sequelize';
import sequelize from '../../config/database';
// congratulations my ki-chan 
// oops sorry , her ki-chat
class Cart extends Model<InferAttributes<Cart>, InferCreationAttributes<Cart>> {
  declare userId: number;
  declare partId: number;
  declare count: CreationOptional<number>;
}

Cart.init(
  {
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    partId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    count: {
      type: DataTypes.INTEGER,
      defaultValue: 1,
    },
  },
  {
    sequelize,
  }
);

export default Cart;

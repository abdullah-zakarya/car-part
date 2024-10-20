import {
  InferCreationAttributes,
  InferAttributes,
  Model,
  DataTypes,
} from 'sequelize';
import sequelize from '../../config/database';

class Cart extends Model<InferAttributes<Cart>, InferCreationAttributes<Cart>> {
  declare userId: number;
  declare partId: number;
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
  },
  {
    sequelize,
  }
);

export default Cart;

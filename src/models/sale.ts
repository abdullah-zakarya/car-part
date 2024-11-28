import {
  InferCreationAttributes,
  InferAttributes,
  CreationOptional,
  Model,
  DataTypes,
} from 'sequelize';
import sequelize from '../../config/database';

class Sale extends Model<InferAttributes<Sale>, InferCreationAttributes<Sale>> {
  declare id: CreationOptional<number>;
  declare userId: number;
  declare partId: number;
  declare quantity: number;
}

Sale.init(
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    partId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    sequelize,
    timestamps: true,
    indexes: [{ fields: ['userId'] }],
  }
);

export default Sale;
// sale : partId ,  quantity , userId

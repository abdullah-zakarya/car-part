import {
  InferCreationAttributes,
  InferAttributes,
  Model,
  DataTypes,
} from 'sequelize';
import sequelize from '../../config/database';

class ResetCode extends Model<
  InferAttributes<ResetCode>,
  InferCreationAttributes<ResetCode>
> {
  declare email: string;
  declare code: string;
  declare expiredAt: Date;
}

ResetCode.init(
  {
    email: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    code: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    expiredAt: {
      type: DataTypes.DATE,
    },
  },
  {
    sequelize,
  }
);

export default ResetCode;

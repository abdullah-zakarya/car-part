import {
  Model,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
} from "sequelize";
import sequelize from "../../config/database";

enum Role {
  user = "user",
  amdin = "admin",
}
enum Gender {
  male = "male",
  female = "female",
}
class User extends Model<InferAttributes<User>, InferCreationAttributes<User>> {
  declare id: CreationOptional<number>;
  declare name: string;
  declare email: string;
  declare password: string;
  declare createdAt: CreationOptional<Date>;
  declare role: CreationOptional<Role>;
  declare gender: Gender;
}

User.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    createdAt: {
      type: DataTypes.DATE,
      defaultValue: Date.now,
    },
    role: {
      type: DataTypes.ENUM("user", "admin"),
      defaultValue: "user",
    },
    gender: {
      type: DataTypes.ENUM("male", "female"),
      allowNull: true,
    },
  },

  {
    sequelize,
    tableName: "users",
    timestamps: true,
    indexes: [
      {
        unique: true,
        fields: ["email"],
      },
    ],
  }
);

export default User;

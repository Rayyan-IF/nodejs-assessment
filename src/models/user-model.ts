import { Sequelize, DataTypes, Model, Optional } from 'sequelize';

export interface UserAttributes {
  id: string;
  name: string;
  email: string;
  password: string;
  token?: string | null;
  created_at: Date;
  created_by: string | null;
  modified_at: Date;
  modified_by: string | null;
  deleted_at: Date | null;
  deleted_by: string | null;
}

// Optional attributes for creation
export interface UserCreationAttributes extends Optional<UserAttributes, 'id' | 'token' | 'created_at' | 'modified_at' | 'deleted_at' | 'created_by' | 'modified_by' | 'deleted_by'> {}

// User model class
export class User extends Model<UserAttributes, UserCreationAttributes> implements UserAttributes {
  declare id: string;
  declare name: string;
  declare email: string;
  declare password: string;
  declare token: string | null;
  declare created_at: Date;
  declare created_by: string | null;
  declare modified_at: Date;
  declare modified_by: string | null;
  declare deleted_at: Date | null;
  declare deleted_by: string | null;
}

export const initUserModel = (sequelize: Sequelize) => {
  User.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        allowNull: false
      },
      name: {
        type: DataTypes.STRING(255),
        allowNull: false,
        validate: {
          notEmpty: true,
          len: [2, 255]
        }
      },
      email: {
        type: DataTypes.STRING(255),
        allowNull: false,
        unique: true,
        validate: {
          isEmail: true,
          notEmpty: true
        }
      },
      password: {
        type: DataTypes.STRING(255),
        allowNull: false,
        validate: {
          len: [6, 255],
          notEmpty: true,
        }
      },
      token: {
        type: DataTypes.TEXT,
        allowNull: true,
        defaultValue: null
      },
      created_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW
      },
      created_by: {
        type: DataTypes.UUID,
        allowNull: true,
        defaultValue: null
      },
      modified_at: {
        type: DataTypes.DATE,
        allowNull: true,
        defaultValue: null
      },
      modified_by: {
        type: DataTypes.UUID,
        allowNull: true,
        defaultValue: null
      },
      deleted_at: {
        type: DataTypes.DATE,
        allowNull: true,
        defaultValue: null
      },
      deleted_by: {
        type: DataTypes.UUID,
        allowNull: true,
        defaultValue: null
      }
    },
    {
      sequelize,
      modelName: 'User',
      tableName: 'users',
      paranoid: true,
      timestamps: false,
      hooks: {
        beforeUpdate: (user: User) => {
          user.modified_at = new Date();
        }
      }
    }
  );

  return User;
};
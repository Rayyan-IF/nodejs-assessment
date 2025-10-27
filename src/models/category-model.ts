import { Sequelize, DataTypes, Model, Optional } from 'sequelize';

export interface CategoryAttributes {
  id: string;
  name: string;
  created_at: Date;
  created_by: string | null;
  modified_at: Date;
  modified_by: string | null;
  deleted_at: Date | null;
  deleted_by: string | null;
}

// Optional attributes for creation
export interface CategoryCreationAttributes extends Optional<CategoryAttributes, 'id' | 'created_at' | 'modified_at' | 'deleted_at' | 'created_by' | 'modified_by' | 'deleted_by'> {}

// Category model class
export class Category extends Model<CategoryAttributes, CategoryCreationAttributes> implements CategoryAttributes {
  declare id: string;
  declare name: string;
  declare created_at: Date;
  declare created_by: string | null;
  declare modified_at: Date;
  declare modified_by: string | null;
  declare deleted_at: Date | null;
  declare deleted_by: string | null;
}

export const initCategoryModel = (sequelize: Sequelize) => {
  Category.init(
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
      paranoid: true,
      timestamps: false,
      modelName: 'Category',
      tableName: 'categories',
      deletedAt: 'deleted_at',
      hooks: {
        beforeUpdate: (category: Category) => {
          category.modified_at = new Date();
        }
      }
    }
  );

  return Category;
};
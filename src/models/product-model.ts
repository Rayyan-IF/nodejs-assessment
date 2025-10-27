import { Sequelize, DataTypes, Model, Optional } from 'sequelize';

export interface ProductAttributes {
  id: string;
  name: string;
  price: number;
  stock: number;
  categoryId: string;
  created_at: Date;
  created_by: string | null;
  modified_at: Date;
  modified_by: string | null;
  deleted_at: Date | null;
  deleted_by: string | null;
}

// Optional attributes for creation
export interface ProductCreationAttributes extends Optional<ProductAttributes, 'id' | 'created_at' | 'modified_at' | 'deleted_at' | 'created_by' | 'modified_by' | 'deleted_by' | 'stock'> {}

// Product model class
export class Product extends Model<ProductAttributes, ProductCreationAttributes> implements ProductAttributes {
  declare id: string;
  declare name: string;
  declare price: number;
  declare stock: number;
  declare categoryId: string;
  declare created_at: Date;
  declare created_by: string | null;
  declare modified_at: Date;
  declare modified_by: string | null;
  declare deleted_at: Date | null;
  declare deleted_by: string | null;
}

// Function to initialize Product model with sequelize instance
export const initProductModel = (sequelize: Sequelize) => {
  Product.init(
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
      price: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        validate: {
          min: 0
        }
      },
      stock: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
        validate: {
          min: 0
        }
      },
      categoryId: {
        type: DataTypes.UUID,
        allowNull: false,
        field: 'category_id'
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
      modelName: 'Product',
      tableName: 'products',
      deletedAt: 'deleted_at',
      hooks: {
        beforeUpdate: (product: Product) => {
          product.modified_at = new Date();
        }
      }
    }
  );

  return Product;
};
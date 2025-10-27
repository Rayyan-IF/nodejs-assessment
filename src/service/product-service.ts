import { models } from '../config/database.js';
import { Validation } from '../validation/validation.js';
import { ResponseError } from '../error/response-error.js';
import { ProductValidation } from '../validation/product-validation.js';
import { ProductResponse, ProductListResponse } from '../dto/response/product-response.js';
import { CreateProductRequest, UpdateProductRequest } from '../dto/request/product-request.js';

export class ProductService {
    static async create(request: CreateProductRequest, userId: string): Promise<ProductResponse> {
        const createRequest = Validation.validate(ProductValidation.CREATE, request);

        const category = await models.Category.findByPk(createRequest.categoryId);
        if (!category) {
            throw new ResponseError(400, "Category not found");
        }

        const product = await models.Product.create({
            ...createRequest,
            created_by: userId
        });

        return {
            id: product.id,
            name: product.name,
            price: product.price,
            stock: product.stock,
            categoryId: product.categoryId,
            created_at: product.created_at,
            created_by: product.created_by,
            modified_at: product.modified_at,
            modified_by: product.modified_by
        };
    }

    static async update(id: string, request: UpdateProductRequest, userId: string): Promise<ProductResponse> {
        const updateRequest = Validation.validate(ProductValidation.UPDATE, request);

        const product = await models.Product.findByPk(id);
        if (!product) {
            throw new ResponseError(404, "Product not found");
        }

        if (updateRequest.categoryId) {
            const category = await models.Category.findByPk(updateRequest.categoryId);
            if (!category) {
                throw new ResponseError(400, "Category not found");
            }
        }

        await models.Product.update(
            {
                ...updateRequest,
                modified_by: userId
            },
            {
                where: { id: id }
            }
        );

        const updatedProduct = await models.Product.findByPk(id);

        return {
            id: updatedProduct!.id,
            name: updatedProduct!.name,
            price: updatedProduct!.price,
            stock: updatedProduct!.stock,
            categoryId: updatedProduct!.categoryId,
            created_at: updatedProduct!.created_at,
            created_by: updatedProduct!.created_by,
            modified_at: updatedProduct!.modified_at,
            modified_by: updatedProduct!.modified_by
        };
    }

    static async getById(id: string): Promise<ProductResponse> {
        const product = await models.Product.findByPk(id, {
            include: [
                {
                    model: models.Category,
                    as: 'category',
                    attributes: ['id', 'name']
                }
            ]
        });
        
        if (!product) {
            throw new ResponseError(404, "Product not found");
        }

        const productWithCategory = product as any;
        return {
            id: product.id,
            name: product.name,
            price: product.price,
            stock: product.stock,
            categoryId: product.categoryId,
            category: productWithCategory.category ? {
                id: productWithCategory.category.id,
                name: productWithCategory.category.name
            } : undefined,
            created_at: product.created_at,
            created_by: product.created_by,
            modified_at: product.modified_at,
            modified_by: product.modified_by
        };
    }

    static async getAll(page: number = 1, limit: number = 10): Promise<ProductListResponse> {
        const offset = (page - 1) * limit;

        const { count, rows } = await models.Product.findAndCountAll({
            include: [
                {
                    model: models.Category,
                    as: 'category',
                    attributes: ['id', 'name']
                }
            ],
            limit: limit,
            offset: offset,
            order: [['created_at', 'DESC']]
        });

        const products: ProductResponse[] = rows.map(product => {
            const productWithCategory = product as any;
            
            return {
                id: product.id,
                name: product.name,
                price: product.price,
                stock: product.stock,
                categoryId: product.categoryId,
                category: productWithCategory.category ? {
                    id: productWithCategory.category.id,
                    name: productWithCategory.category.name
                } : undefined,
                created_at: product.created_at,
                created_by: product.created_by,
                modified_at: product.modified_at,
                modified_by: product.modified_by
            };
        });

        return {
            products: products,
            total: count,
            page: page,
            limit: limit
        };
    }

    static async delete(id: string, userId: string): Promise<void> {
        const product = await models.Product.findByPk(id);
        if (!product) {
            throw new ResponseError(404, "Product not found");
        }

        await models.Product.update(
            {
                deleted_by: userId
            },
            {
                where: { id: id }
            }
        );

        await models.Product.destroy({
            where: { id: id }
        });
    }
}
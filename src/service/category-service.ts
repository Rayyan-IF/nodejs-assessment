import { Op } from 'sequelize';
import { models } from '../config/database.js';
import { Validation } from '../validation/validation.js';
import { ResponseError } from '../error/response-error.js';
import { CategoryValidation } from '../validation/category-validation.js';
import { CategoryResponse, CategoryListResponse } from '../dto/response/category-response.js';
import { CreateCategoryRequest, UpdateCategoryRequest } from '../dto/request/category-request.js';

export class CategoryService {
    static async create(request: CreateCategoryRequest, userId: string): Promise<CategoryResponse> {
        const createRequest = Validation.validate(CategoryValidation.CREATE, request);

        const totalCategoryWithSameName = await models.Category.count({
            where: {
                name: createRequest.name
            }
        });

        if (totalCategoryWithSameName != 0) {
            throw new ResponseError(400, "Category name already exists");
        }

        const category = await models.Category.create({
            ...createRequest,
            created_by: userId
        });

        return {
            id: category.id,
            name: category.name,
            created_at: category.created_at,
            created_by: category.created_by,
            modified_at: category.modified_at,
            modified_by: category.modified_by
        };
    }

    static async update(id: string, request: UpdateCategoryRequest, userId: string): Promise<CategoryResponse> {
        const updateRequest = Validation.validate(CategoryValidation.UPDATE, request);

        const category = await models.Category.findByPk(id);
        if (!category) {
            throw new ResponseError(404, "Category not found");
        }

        const totalCategoryWithSameName = await models.Category.count({
            where: {
                name: updateRequest.name,
                id: { [Op.ne]: id }
            }
        });

        if (totalCategoryWithSameName != 0) {
            throw new ResponseError(400, "Category name already exists");
        }

        await models.Category.update(
            {
                ...updateRequest,
                modified_by: userId
            },
            {
                where: { id: id }
            }
        );

        const updatedCategory = await models.Category.findByPk(id);

        return {
            id: updatedCategory!.id,
            name: updatedCategory!.name,
            created_at: updatedCategory!.created_at,
            created_by: updatedCategory!.created_by,
            modified_at: updatedCategory!.modified_at,
            modified_by: updatedCategory!.modified_by
        };
    }

    static async getById(id: string): Promise<CategoryResponse> {
        const category = await models.Category.findByPk(id);
        
        if (!category) {
            throw new ResponseError(404, "Category not found");
        }

        return {
            id: category.id,
            name: category.name,
            created_at: category.created_at,
            created_by: category.created_by,
            modified_at: category.modified_at,
            modified_by: category.modified_by
        };
    }

    static async getAll(page: number = 1, limit: number = 10, category?: string): Promise<CategoryListResponse> {
        const offset = (page - 1) * limit;

        const whereCondition: any = {};
        if (category) {
            whereCondition.name = {
                [Op.like]: `%${category}%`
            };
        }

        const { count, rows } = await models.Category.findAndCountAll({
            where: whereCondition,
            limit: limit,
            offset: offset,
            order: [['created_at', 'DESC']]
        });

        const categories: CategoryResponse[] = rows.map(category => ({
            id: category.id,
            name: category.name,
            created_at: category.created_at,
            created_by: category.created_by,
            modified_at: category.modified_at,
            modified_by: category.modified_by
        }));

        return {
            page: page,
            total: count,
            limit: limit,
            categories: categories,
        };
    }

    static async delete(id: string, userId: string): Promise<void> {
        const category = await models.Category.findByPk(id);
        if (!category) {
            throw new ResponseError(404, "Category not found");
        }

        await models.Category.update(
            {
                deleted_by: userId
            },
            {
                where: { id: id }
            }
        );

        await models.Category.destroy({
            where: { id: id }
        });
    }
}
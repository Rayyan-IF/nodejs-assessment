import { Response, NextFunction } from "express";
import { CategoryService } from "../service/category-service.js";
import { CreateCategoryRequest, UpdateCategoryRequest } from '../dto/request/category-request.js';
import { AuthenticatedRequest } from '../middleware/auth-middleware.js';

export class CategoryController {
    static async create(req: AuthenticatedRequest, res: Response, next: NextFunction) {
        try {
            const request: CreateCategoryRequest = req.body as CreateCategoryRequest;
            const userId = req.user!.userId; // userId from auth middleware
            
            const response = await CategoryService.create(request, userId);
            
            res.status(201).json({
                data: response
            });
        } catch (e) {
            next(e);
        }
    }

    static async update(req: AuthenticatedRequest, res: Response, next: NextFunction) {
        try {
            const categoryId = req.params.id;
            const request: UpdateCategoryRequest = req.body as UpdateCategoryRequest;
            const userId = req.user!.userId; // userId from auth middleware
            
            const response = await CategoryService.update(categoryId, request, userId);
            
            res.status(200).json({
                data: response
            });
        } catch (e) {
            next(e);
        }
    }

    static async getById(req: AuthenticatedRequest, res: Response, next: NextFunction) {
        try {
            const categoryId = req.params.id;
            const response = await CategoryService.getById(categoryId);
            
            res.status(200).json({
                data: response
            });
        } catch (e) {
            next(e);
        }
    }

    static async getAll(req: AuthenticatedRequest, res: Response, next: NextFunction) {
        try {
            const category = req.query.category as string;
            const page = parseInt(req.query.page as string) || 1;
            const limit = parseInt(req.query.limit as string) || 10;
            
            const response = await CategoryService.getAll(page, limit, category);
            
            res.status(200).json({
                data: response
            });
        } catch (e) {
            next(e);
        }
    }

    static async delete(req: AuthenticatedRequest, res: Response, next: NextFunction) {
        try {
            const categoryId = req.params.id;
            const userId = req.user!.userId;
            
            await CategoryService.delete(categoryId, userId);
            
            res.status(200).json({
                message: "Category deleted successfully"
            });
        } catch (e) {
            next(e);
        }
    }
}
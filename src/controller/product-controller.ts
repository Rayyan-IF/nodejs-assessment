import { Response, NextFunction } from "express";
import { ProductService } from "../service/product-service.js";
import { CreateProductRequest, UpdateProductRequest } from '../dto/request/product-request.js';
import { AuthenticatedRequest } from '../middleware/auth-middleware.js';

export class ProductController {
    static async create(req: AuthenticatedRequest, res: Response, next: NextFunction) {
        try {
            const request: CreateProductRequest = req.body as CreateProductRequest;
            const userId = req.user!.userId;
            
            const response = await ProductService.create(request, userId);
            
            res.status(201).json({
                data: response
            });
        } catch (e) {
            next(e);
        }
    }

    static async update(req: AuthenticatedRequest, res: Response, next: NextFunction) {
        try {
            const productId = req.params.id;
            const request: UpdateProductRequest = req.body as UpdateProductRequest;
            const userId = req.user!.userId;
            
            const response = await ProductService.update(productId, request, userId);
            
            res.status(200).json({
                data: response
            });
        } catch (e) {
            next(e);
        }
    }

    static async getById(req: AuthenticatedRequest, res: Response, next: NextFunction) {
        try {
            const productId = req.params.id;
            const response = await ProductService.getById(productId);
            
            res.status(200).json({
                data: response
            });
        } catch (e) {
            next(e);
        }
    }

    static async getAll(req: AuthenticatedRequest, res: Response, next: NextFunction) {
        try {
            const page = parseInt(req.query.page as string) || 1;
            const limit = parseInt(req.query.limit as string) || 10;
            
            const response = await ProductService.getAll(page, limit);
            
            res.status(200).json({
                data: response
            });
        } catch (e) {
            next(e);
        }
    }

    static async delete(req: AuthenticatedRequest, res: Response, next: NextFunction) {
        try {
            const productId = req.params.id;
            const userId = req.user!.userId;
            
            await ProductService.delete(productId, userId);
            
            res.status(200).json({
                message: "Product deleted successfully"
            });
        } catch (e) {
            next(e);
        }
    }
}
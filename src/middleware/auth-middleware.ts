import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';
import { ResponseError } from '../error/response-error.js';

export interface AuthenticatedRequest extends Request {
    user?: {
        userId: string;
        email: string;
    };
}

export const authMiddleware = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
        const authHeader = req.headers.authorization;
        
        if (!authHeader) {
            throw new ResponseError(401, "Access token is required");
        }

        const token = authHeader.split(' ')[1];
        
        if (!token) {
            throw new ResponseError(401, "Invalid token format");
        }

        const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET!) as any;
        
        req.user = {
            userId: decoded.userId,
            email: decoded.email
        };

        next();
    } catch (error) {
        return next(new ResponseError(500, "Authentication failed"));
    }
};
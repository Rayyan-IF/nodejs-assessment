import { logger } from "../config/logging.js";
import { Request, Response, NextFunction } from "express";

export const requestLoggingMiddleware = (req: Request, res: Response, next: NextFunction) => {
    const startTime = Date.now();

    let logMessage = `[INCOMING] ${req.method} ${req.originalUrl}`;
    
    if (req.method === 'POST' || req.method === 'PUT' || req.method === 'PATCH') {
        const body = { ...req.body };
        if (body.password) {
            body.password = '[HIDDEN]';
        }
        logMessage += ` - Body: ${JSON.stringify(body)}`;
    }
    
    logger.info(logMessage);
    
    // Track response completion
    res.on('finish', () => {
        const endTime = Date.now();
        const statusCode = res.statusCode;
        const duration = endTime - startTime;
        
        let logLevel: 'info' | 'warn' | 'error' = 'info';
        let status = 'SUCCESS';
        
        if (statusCode >= 500) {
            status = 'ERROR';
            logLevel = 'error';
        } else if (statusCode >= 400) {
            logLevel = 'warn';
            status = 'CLIENT_ERROR';
        }
        
        // Log response completion
        logger[logLevel](`[${status}] ${req.method} ${req.originalUrl} - ${statusCode} - ${duration}ms`);
    });
    
    next();
};
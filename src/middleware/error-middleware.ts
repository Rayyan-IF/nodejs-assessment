import {ZodError} from "zod";
import {Response, Request, NextFunction} from "express";
import {ResponseError} from "../error/response-error.js";

export const errorMiddleware = async (error: Error, req: Request, res: Response, next: NextFunction) => {
    if (error instanceof ZodError) {
        const formatted = error.issues.map((e) => ({
          field: e.path.join("."),
          message: e.message,
        }));

        return res.status(400).json({
            errors: formatted
        });
    } else if (error instanceof ResponseError) {
        res.status(error.status).json({
            errors: error.message
        });
    } else {
        res.status(500).json({
            errors: error.message
        });
    }
}
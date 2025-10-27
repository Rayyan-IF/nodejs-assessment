import {Request, Response, NextFunction} from "express";
import { UserService } from "../service/user-service.js";
import { RegisterUserRequest, LoginUserRequest } from '../dto/request/user-request.js';

export class UserController {
    static async login(req: Request, res: Response, next: NextFunction) {
        try {
            const request: LoginUserRequest = req.body as LoginUserRequest;
            const response = await UserService.login(request.email, request.password);
            
            res.cookie('refreshToken', response.refreshToken, {
                secure: true,
                httpOnly: true,
                sameSite: 'strict',
                maxAge: 7 * 24 * 60 * 60 * 1000,
            });

            res.status(200).json({
                data: {
                    name: response.name,
                    email: response.email,
                    token: response.accessToken
                }
            })
        } catch (e) {
            next(e);
        }
    }

    static async register(req: Request, res: Response, next: NextFunction) {
        try {
            const request: RegisterUserRequest = req.body as RegisterUserRequest;
            const response = await UserService.register(request);
            res.status(201).json({
                data: response
            })
        } catch (e) {
            next(e);
        }
    }

    static async refreshToken(req: Request, res: Response, next: NextFunction) {
        try {
            const refreshToken = req.cookies.refreshToken;
            const response = await UserService.refreshToken(refreshToken);
            
            res.status(200).json({
                data: response
            });
        } catch (e) {
            next(e);
        }
    }
}
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { models } from '../config/database.js';
import { Validation } from '../validation/validation.js';
import { ResponseError } from '../error/response-error.js';
import { UserValidation } from '../validation/user-validation.js';
import { AuthUserResponse } from '../dto/response/user-response.js';
import { RegisterUserRequest } from '../dto/request/user-request.js';

export class UserService {
    static async register(request: RegisterUserRequest): Promise<AuthUserResponse> {
        const registerRequest = Validation.validate(UserValidation.REGISTER, request);

        const totalUserWithSameEmail = await models.User.count({
            where: {
                email: registerRequest.email
            }
        });

        if (totalUserWithSameEmail != 0) {
            throw new ResponseError(400, "Email already exists");
        }

        registerRequest.password = await bcrypt.hash(registerRequest.password, 10);

        const user = await models.User.create(registerRequest);

        return {
            name: user.name,
            email: user.email,
        };
    }

    static async login(email: string, password: string): Promise<AuthUserResponse> {
        const user = await models.User.findOne({
            where: {
                email: email
            }
        });

        if (!user) {
            throw new ResponseError(401, "Invalid email or password");
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            throw new ResponseError(401, "Invalid email or password");
        }

        const accessToken = jwt.sign({ userId: user.id, email: user.email }, process.env.ACCESS_TOKEN_SECRET!, { expiresIn: "30m" });
        
        const refreshToken = jwt.sign({ userId: user.id, email: user.email }, process.env.REFRESH_TOKEN_SECRET!, { expiresIn: "7d", });
        await models.User.update({ token: refreshToken }, { where: { id: user.id } });

        return {
            name: user.name,
            email: user.email,
            accessToken: accessToken,
            refreshToken: refreshToken
        };
    }

    static async refreshToken(refreshToken: string): Promise<{ accessToken: string }> {
        if (!refreshToken) {
            throw new ResponseError(401, "No refresh token provided");
        }

        const user = await models.User.findOne({
            where: {
                token: refreshToken
            }
        });

        if (!user) {
            throw new ResponseError(401, "Invalid refresh token");
        }

        try {
            const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET!) as any;
            const accessToken = jwt.sign({ userId: decoded.userId, email: decoded.email }, process.env.ACCESS_TOKEN_SECRET!, { expiresIn: "30m" });
            
            return { accessToken: accessToken };
        } catch (err) {
            throw new ResponseError(403, "Refresh token expired");
        }
    }

}
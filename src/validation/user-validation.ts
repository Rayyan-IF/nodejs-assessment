import { LoginUserSchema, RegisterUserSchema } from "../dto/request/user-request.js";

export class UserValidation {
    static readonly LOGIN = LoginUserSchema;
    static readonly REGISTER = RegisterUserSchema;
}
import { CreateCategorySchema, UpdateCategorySchema } from "../dto/request/category-request.js";

export class CategoryValidation {
    static readonly CREATE = CreateCategorySchema;
    static readonly UPDATE = UpdateCategorySchema;
}
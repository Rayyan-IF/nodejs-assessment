import { CreateProductSchema, UpdateProductSchema } from "../dto/request/product-request.js";

export class ProductValidation {
    static readonly CREATE = CreateProductSchema;
    static readonly UPDATE = UpdateProductSchema;
}
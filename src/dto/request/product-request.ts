import { z } from "zod";

export const CreateProductSchema = z.object({
  name: z.string().min(2).max(255).trim(),
  price: z.number().min(0),
  stock: z.number().int().min(0).optional().default(0),
  categoryId: z.string().min(1), 
});

export const UpdateProductSchema = z.object({
  name: z.string().min(2).max(255).trim().optional(),
  price: z.number().min(0).optional(),
  stock: z.number().int().min(0).optional(),
  categoryId: z.string().min(1).optional()
});

export type CreateProductRequest = z.infer<typeof CreateProductSchema>;
export type UpdateProductRequest = z.infer<typeof UpdateProductSchema>;
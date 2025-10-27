import { z } from "zod";

export const CreateCategorySchema = z.object({
  name: z.string().min(2).max(255).trim()
});

export const UpdateCategorySchema = z.object({
  name: z.string().min(2).max(255).trim()
});

export type CreateCategoryRequest = z.infer<typeof CreateCategorySchema>;
export type UpdateCategoryRequest = z.infer<typeof UpdateCategorySchema>;
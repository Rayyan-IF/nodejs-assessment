import { z } from "zod";

export const LoginUserSchema = z.object({
  email: z.string().email().min(1).max(255),
  password: z.string().min(6).max(255)
});

export const RegisterUserSchema = z.object({
  name: z.string().min(1).max(100),
  email: z.string().email().min(1).max(255),
  password: z.string().min(6).max(255),
});

export type LoginUserRequest = z.infer<typeof LoginUserSchema>;
export type RegisterUserRequest = z.infer<typeof RegisterUserSchema>;
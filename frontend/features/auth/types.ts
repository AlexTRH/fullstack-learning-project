import { z } from "zod";

export const schema = z
  .object({
    fullname: z.string().trim().min(1, "Name is required").max(100, "Name is too long"),
    email: z.string().email("Invalid email format"),
    username: z
      .string()
      .trim()
      .min(3, "Username must be at least 3 characters")
      .max(30, "Username must be at most 30 characters")
      .regex(
        /^[a-zA-Z0-9_]+$/,
        "Username can only contain letters, numbers, and underscores"
      ),
    password: z
      .string()
      .trim()
      .min(8, "Password must be at least 8 characters")
      .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
      .regex(/[a-z]/, "Password must contain at least one lowercase letter")
      .regex(/[0-9]/, "Password must contain at least one number"),
    confirmPassword: z.string().trim().min(8),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

export type SignUpFormUserData = z.infer<typeof schema>;

const loginSchema = z.object({
  email: z.string().email("Invalid email format"),
  password: z.string().min(1, "Password is required"),
});

export type LoginFormData = z.infer<typeof loginSchema>;
export { loginSchema };

type SignUpResponseData = {
  accessToken: string;
  refreshToken: string;
  user: {
    avatar: string | null;
    bio: string | null;
    createdAt: string;
    email: string;
    id: string;
    name: string;
    username: string;
  };
};

export type SignUpResponse = {
  data: SignUpResponseData;
  success: boolean;
};

export type LoginResponse = SignUpResponse;

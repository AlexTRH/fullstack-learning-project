import { z } from "zod";

export const schema = z
  .object({
    fullname: z.string().trim().min(2),
    email: z.string().email(),
    password: z.string().trim().min(8),
    confirmPassword: z.string().trim().min(8),
    username: z.string().trim().min(2),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords dont match",
    path: ["confirmPassword"],
  });

export type SignUpFormUserData = z.infer<typeof schema>;

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

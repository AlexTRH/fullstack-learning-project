import { z } from "zod";

export const updateProfileSchema = z.object({
  name: z.string().max(100, "Name is too long"),
  bio: z.string().max(500, "Bio is too long"),
  avatar: z.union([z.string().url("Avatar must be a valid URL"), z.literal("")]),
});

export type UpdateProfileFormData = z.infer<typeof updateProfileSchema>;

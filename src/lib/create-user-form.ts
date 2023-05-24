import { z } from "zod";

export const createUserFormData = z.object({
  fullName: z.string().min(5),
});

export type CreateUserFormData = z.infer<typeof createUserFormData>;

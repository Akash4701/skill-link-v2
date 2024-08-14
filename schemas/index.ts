import { z } from "zod";

const UserGender = z.enum(["male", "female", "others"]);
export const SettingsSchema = z
  .object({
    name: z.string().optional(),
    email: z.string().email({ message: "Invalid email format" }).optional(),
    password: z
      .string()
      .min(6, { message: "Minimum of 6 characters required for password" })
      .optional(),
    newPassword: z
      .string()
      .min(6, { message: "Minimum of 6 characters required for new password" })
      .optional(),
    primarySkill: z.string().optional(),
    secondarySkills: z.string().optional(),
    country: z.string().optional(),
    location: z.string().optional(),
    posts: z.array(z.string()).optional(),
    about: z.string(),
    projects: z
      .array(z.string().url({ message: "Invalid URL format" }))
      .optional(),
    institution: z.string().optional(),
    study: z.string().optional(),
    profilePic: z.string().url({ message: "Invalid URL format" }).optional(),
    gender: UserGender.optional(),
    birthday: z.string().optional(),
  })
  .refine(
    (data) => {
      if (data.password && !data.newPassword) {
        return false;
      }
      return true;
    },
    {
      message: "New password is required if password is provided!",
      path: ["newPassword"],
    },
  )
  .refine(
    (data) => {
      if (data.newPassword && !data.password) {
        return false;
      }
      return true;
    },
    {
      message: "Password is required if new password is provided!",
      path: ["password"],
    },
  );

export const NewPasswordSchema = z.object({
  password: z.string().min(6, {
    message: "Minimum of 6 characters required",
  }),
});

export const ResetSchema = z.object({
  email: z.string().email({
    message: "Email is required",
  }),
});

export const LoginSchema = z.object({
  email: z.string().email({
    message: "Email is required",
  }),
  password: z.string().min(1, {
    message: "Password is required",
  }),
  code: z.optional(z.string()),
});

export const RegisterSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  birthday: z.string().refine((val) => {
    const date = new Date(val);
    return !isNaN(date.getTime());
  }, "Invalid date format"),
});

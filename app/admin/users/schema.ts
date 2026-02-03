import z from "zod";
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png"];

export const UserSchema = z.object({
    fullName: z.string().min(2, { message: "minimim 2 character is needed" }),
    phoneNumber: z
        .string()
        .regex(/^[0-9]{10}$/, {
            message: "Phone number must be exactly 10 digits",
        }),
    imageUrl: z
        .instanceof(File)
        .optional()
        .refine((file) => !file || file.size <= MAX_FILE_SIZE, {
            message: "Max file size is 5MB",
        })
        .refine((file) => !file || ACCEPTED_IMAGE_TYPES.includes(file.type), {
            message: "Only .jpg, .jpeg, .png and .webp formats are supported",
        }),
    password: z
        .string()
        .min(6, "Minimum 6 characters")
        .regex(/[A-Za-z]/, "Must include a letter")
        .regex(/[0-9]/, "Must include a number"),
    confirmPassword: z.string(),
}).refine(
    (data) => data.password === data.confirmPassword,
    {
        message: "Passwords do not match", path: ["confirmPassword"]
    }
);

export type UserData = z.infer<typeof UserSchema>;


export const UserEditSchema = UserSchema.partial()
export type UserEditData = z.infer<typeof UserEditSchema>;
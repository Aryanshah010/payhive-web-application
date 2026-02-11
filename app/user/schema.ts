import z from "zod";

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"];

export const updateUserSchema = z.object({

    fullName: z.preprocess(
        (val) => (typeof val === "string" && val.trim() === "" ? undefined : val),
        z.string().min(2, { message: "minimum 2 characters are needed" }).optional()
    ),

    password: z.preprocess(
        (val) => (typeof val === "string" && val.trim() === "" ? undefined : val),
        z
            .string()
            .min(6, "Minimum 6 characters")
            .regex(/[A-Za-z]/, "Must include a letter")
            .regex(/[0-9]/, "Must include a number")
            .optional()
    ),

    imageUrl: z
        .instanceof(File)
        .optional()
        .refine((file) => !file || file.size <= MAX_FILE_SIZE, {
            message: "Max file size is 5MB",
        })
        .refine((file) => !file || ACCEPTED_IMAGE_TYPES.includes(file.type), {
            message: "Only .jpg, .jpeg, .png and .webp formats are supported",
        }),
});

export type UpdateUserFormInput = z.input<typeof updateUserSchema>;

export type UpdateUserData = z.infer<typeof updateUserSchema>;
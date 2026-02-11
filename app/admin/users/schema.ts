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
    email: z.email({ message: "Invalid email address" }),
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

export const AdminUserEditSchema = z
    .object({
        fullName: z.string().min(2, { message: "minimim 2 character is needed" }),
        phoneNumber: z
            .string()
            .regex(/^[0-9]{10}$/, {
                message: "Phone number must be exactly 10 digits",
            }),
        email: z.email({ message: "Invalid email address" }),
        role: z.enum(["user", "admin"]),
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
            .optional()
            .transform((val) => (val?.trim() === "" ? undefined : val))
            .refine(
                (val) =>
                    val === undefined ||
                    (val.length >= 6 &&
                        /[A-Za-z]/.test(val) &&
                        /[0-9]/.test(val)),
                {
                    message:
                        "Password must be at least 6 characters and include a letter and a number",
                }
            ),

        confirmPassword: z
            .string()
            .optional()
            .transform((val) => (val?.trim() === "" ? undefined : val)),


    })
    .superRefine((data, ctx) => {
        if (!data.password && !data.confirmPassword) return;

        if (!data.password && data.confirmPassword) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: "Password is required",
                path: ["password"],
            });
        }

        if (data.password && !data.confirmPassword) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: "Confirm password is required",
                path: ["confirmPassword"],
            });
        }

        if (data.password && data.confirmPassword && data.password !== data.confirmPassword) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: "Passwords do not match",
                path: ["confirmPassword"],
            });
        }
    });

export type AdminUserEditData = z.infer<typeof AdminUserEditSchema>;

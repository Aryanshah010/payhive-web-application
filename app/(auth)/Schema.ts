import z from "zod";

export const registerScheme = z.object({
    fullName: z.string().min(3, { message: "minimum 3 characters are needed" }),
    phoneNumber: z
        .string()
        .regex(/^[0-9]{10}$/, {
            message: "Phone number must be exactly 10 digits",
        }),
    email: z.email({ message: "Email is invalid" }),
    password: z
        .string()
        .min(6, "Minimum 6 characters")
        .regex(/[A-Z]/, "Must include an uppercase letter")
        .regex(/[0-9]/, "Must include a number"),
    confirmPassword: z.string(),
}).refine(
    (data) => data.password === data.confirmPassword,
    {
        message: "Passwords do not match", path: ["confirmPassword"]
    }
);

export type RegisterType = z.infer<typeof registerScheme>;


export const loginSchema = z.object({
    phoneNumber: z
        .string()
        .regex(/^[0-9]{10}$/, {
            message: "Phone number must be exactly 10 digits",
        }),
    password: z
        .string()
        .min(6, "Minimum 6 characters")
        .regex(/[A-Za-z]/, "Must include a letter")
        .regex(/[0-9]/, "Must include a number"),
});

export type LoginType = z.infer<typeof loginSchema>;

export const forgotPasswordSchema = z.object({
    email: z.email({ message: "Email is invalid" }),
});

export type ForgotPasswordType = z.infer<typeof forgotPasswordSchema>;

export const resetPasswordSchema = z.object({
    newPassword: z
        .string()
        .min(6, "Minimum 6 characters")
        .regex(/[A-Z]/, "Must include an uppercase letter")
        .regex(/[0-9]/, "Must include a number"),
    confirmPassword: z.string(),
}).refine(
    (data) => data.newPassword === data.confirmPassword,
    {
        message: "Passwords do not match", path: ["confirmPassword"]
    }
);

export type ResetPasswordType = z.infer<typeof resetPasswordSchema>;

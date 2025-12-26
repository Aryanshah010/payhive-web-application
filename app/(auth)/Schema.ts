import z from "zod";

export const registerScheme = z.object({
    fullName: z.string().min(2, { message: "minimim 2 character is needed" }),
    phoneNumber: z
        .string()
        .regex(/^[0-9]{10}$/, {
            message: "Phone number must be exactly 10 digits",
        }),
    Password: z
        .string()
        .min(6, "Minimum 6 characters")
        .regex(/[A-Za-z]/, "Must include a letter")
        .regex(/[0-9]/, "Must include a number"),
    confirmPassword: z.string(),
}).refine(
    (data) => data.Password === data.confirmPassword,
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
    Password: z
        .string()
        .min(6, "Minimum 6 characters")
        .regex(/[A-Za-z]/, "Must include a letter")
        .regex(/[0-9]/, "Must include a number"),
});

export type LoginType = z.infer<typeof loginSchema>;

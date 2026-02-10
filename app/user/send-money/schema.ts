import z from "zod";

export const beneficiaryLookupSchema = z.object({
  phoneNumber: z
    .string()
    .regex(/^[0-9]{10}$/, "Phone number must be exactly 10 digits"),
});

export type BeneficiaryLookupInput = z.infer<typeof beneficiaryLookupSchema>;

export const amountSchema = z.object({
  amount: z
    .number()
    .optional()
    .refine((val) => val !== undefined, {
      message: "Amount is required",
    })
    .refine((val) => val! > 0, "Amount must be greater than 0")
    .refine(
      (val) => Number.isInteger(val! * 100),
      "Amount must have at most 2 decimal places"
    ),
  remark: z.string().max(140, "Remark must be at most 140 characters").optional(),
});


export type AmountInput = z.infer<typeof amountSchema>;

export const pinSchema = z.object({
  pin: z
    .string()
    .regex(/^[0-9]{4}$/, "PIN must be exactly 4 digits"),
});

export type PinInput = z.infer<typeof pinSchema>;

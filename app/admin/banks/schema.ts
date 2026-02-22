import z from "zod";
import type { CreateBankPayload, UpdateBankPayload } from "@/lib/types/admin-bank";

const hasTwoOrFewerDecimals = (value: number) => Number.isInteger(value * 100);

const amountSchema = z
  .coerce
  .number({ message: "Amount must be a number" })
  .positive("Amount must be greater than 0")
  .refine(hasTwoOrFewerDecimals, "Amount must have at most 2 decimal places");

const canCompileRegex = (pattern: string) => {
  try {
    new RegExp(pattern);
    return true;
  } catch {
    return false;
  }
};

const baseBankSchema = z.object({
  name: z.string().trim().min(2, "Bank name is required"),
  code: z
    .string()
    .trim()
    .min(2, "Bank code is required")
    .max(20, "Bank code is too long")
    .regex(
      /^[A-Za-z0-9_-]+$/,
      "Bank code can only contain letters, numbers, _ and -",
    ),
  accountNumberRegex: z
    .string()
    .trim()
    .min(1, "Account number regex is required")
    .refine((value) => canCompileRegex(value), "Account number regex is invalid"),
  isActive: z.boolean(),
  minTransfer: amountSchema,
  maxTransfer: amountSchema,
});

export const createBankSchema = baseBankSchema.superRefine((value, ctx) => {
  if (value.minTransfer >= value.maxTransfer) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "Minimum transfer must be less than maximum transfer",
      path: ["minTransfer"],
    });
  }
});

export const editBankSchema = createBankSchema;

export type CreateBankFormInput = z.input<typeof createBankSchema>;
export type CreateBankFormValues = z.output<typeof createBankSchema>;

export type EditBankFormInput = z.input<typeof editBankSchema>;
export type EditBankFormValues = z.output<typeof editBankSchema>;

export const toBankCreatePayload = (
  values: CreateBankFormValues,
): CreateBankPayload => {
  return {
    name: values.name.trim(),
    code: values.code.trim().toUpperCase(),
    accountNumberRegex: values.accountNumberRegex.trim(),
    isActive: values.isActive,
    minTransfer: values.minTransfer,
    maxTransfer: values.maxTransfer,
  };
};

export const toBankUpdatePayload = (
  values: EditBankFormValues,
): UpdateBankPayload => {
  return toBankCreatePayload(values);
};

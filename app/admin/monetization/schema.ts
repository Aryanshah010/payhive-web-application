import z from "zod";
import type {
  CreateFeeConfigPayload,
  FeeAppliesTo,
  UpdateFeeConfigPayload,
} from "@/lib/types/admin-fee-config";

const hasTwoOrFewerDecimals = (value: number) => Number.isInteger(value * 100);

const amountSchema = z
  .coerce
  .number({ message: "Amount must be a number" })
  .min(0, "Amount must be at least 0")
  .refine(hasTwoOrFewerDecimals, "Amount must have at most 2 decimal places");

const appliesToSchema = z
  .array(z.enum(["flight", "hotel", "internet", "topup", "recharge"]))
  .min(1, "Select at least one service")
  .refine(
    (values) => {
      const normalized = values.map((value) =>
        value === "recharge" ? "topup" : value,
      );
      return new Set(normalized).size === normalized.length;
    },
    "Topup and recharge cannot be selected together",
  );

const baseFeeConfigSchema = z.object({
  type: z.literal("service_payment"),
  description: z.string().trim().min(2, "Description is required"),
  calculation: z.object({
    mode: z.literal("fixed"),
    fixedAmount: amountSchema,
  }),
  appliesTo: appliesToSchema,
  isActive: z.boolean(),
});

export const createFeeConfigSchema = baseFeeConfigSchema;
export const editFeeConfigSchema = baseFeeConfigSchema;

export type CreateFeeConfigFormInput = z.input<typeof createFeeConfigSchema>;
export type CreateFeeConfigFormValues = z.output<typeof createFeeConfigSchema>;

export type EditFeeConfigFormInput = z.input<typeof editFeeConfigSchema>;
export type EditFeeConfigFormValues = z.output<typeof editFeeConfigSchema>;

export const toFeeConfigCreatePayload = (
  values: CreateFeeConfigFormValues,
): CreateFeeConfigPayload => {
  return {
    type: "service_payment",
    description: values.description.trim(),
    calculation: {
      mode: "fixed",
      fixedAmount: values.calculation.fixedAmount,
    },
    appliesTo: values.appliesTo as FeeAppliesTo[],
    isActive: values.isActive,
  };
};

export const toFeeConfigUpdatePayload = (
  values: EditFeeConfigFormValues,
): UpdateFeeConfigPayload => {
  return toFeeConfigCreatePayload(values);
};

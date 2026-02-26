import type { FeeAppliesTo, FeeConfigType } from "@/lib/types/admin-fee-config";

export const APPLIES_TO_OPTIONS: Array<{ value: FeeAppliesTo; label: string }> = [
  { value: "flight", label: "Flights" },
  { value: "hotel", label: "Hotels" },
  { value: "internet", label: "Internet" },
  { value: "topup", label: "Topup" },
  { value: "recharge", label: "Recharge" },
];

export const FEE_TYPE_LABELS: Record<FeeConfigType, string> = {
  service_payment: "Service Payment",
};

export const formatAppliesTo = (values: FeeAppliesTo[]) => {
  return values
    .map(
      (value) =>
        APPLIES_TO_OPTIONS.find((option) => option.value === value)?.label ||
        value,
    )
    .join(", ");
};

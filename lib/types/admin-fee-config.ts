export type AdminFeeConfigApiError = {
  message: string;
  status?: number;
  code?: string;
  details?: unknown;
};

export type FeeConfigType = "service_payment";
export type FeeCalculationMode = "fixed";
export type FeeAppliesTo = "flight" | "hotel" | "internet" | "topup" | "recharge";

export type FeeCalculation = {
  mode: FeeCalculationMode;
  fixedAmount: number;
};

export type AdminFeeConfig = {
  _id: string;
  type: FeeConfigType;
  description: string;
  calculation: FeeCalculation;
  appliesTo: FeeAppliesTo[];
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
};

export type FeeConfigListQuery = {
  page?: number;
  limit?: number;
  type?: FeeConfigType;
  appliesTo?: FeeAppliesTo;
  isActive?: boolean;
};

export type CreateFeeConfigPayload = {
  type: FeeConfigType;
  description: string;
  calculation: FeeCalculation;
  appliesTo: FeeAppliesTo[];
  isActive: boolean;
};

export type UpdateFeeConfigPayload = Partial<CreateFeeConfigPayload>;

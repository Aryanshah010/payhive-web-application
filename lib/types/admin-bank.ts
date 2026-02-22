export type AdminBankApiError = {
  message: string;
  status?: number;
  code?: string;
  details?: unknown;
};

export type AdminBank = {
  _id: string;
  name: string;
  code: string;
  accountNumberRegex: string;
  isActive: boolean;
  minTransfer: number;
  maxTransfer: number;
  createdAt?: string;
  updatedAt?: string;
};

export type CreateBankPayload = {
  name: string;
  code: string;
  accountNumberRegex: string;
  isActive: boolean;
  minTransfer: number;
  maxTransfer: number;
};

export type UpdateBankPayload = Partial<CreateBankPayload>;

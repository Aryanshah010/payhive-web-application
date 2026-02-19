/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from "./axios";
import { API } from "./endpoints";

type ApiError = Error & { status?: number; details?: any };

export type TransactionHistoryDirection = "all" | "debit" | "credit";

export type GetTransactionHistoryParams = {
  page?: number;
  limit?: number;
  search?: string;
  direction?: TransactionHistoryDirection;
};

const throwApiError = (error: any, fallback: string) => {
  const message =
    error.response?.data?.message || error.message || fallback;
  const err: ApiError = new Error(message);
  err.details = error.response?.data?.data;
  err.status = error.response?.status;
  throw err;
};

export const lookupBeneficiary = async (phoneNumber: string) => {
  try {
    const response = await axios.get(API.TRANSACTIONS.BENEFICIARY, {
      params: { phoneNumber },
    });
    return response.data;
  } catch (error: any) {
    throwApiError(error, "Lookup beneficiary failed");
  }
};

export const previewTransfer = async (payload: {
  toPhoneNumber: string;
  amount: number;
  remark?: string;
}) => {
  try {
    const response = await axios.post(API.TRANSACTIONS.PREVIEW, payload);
    return response.data;
  } catch (error: any) {
    throwApiError(error, "Preview transfer failed");
  }
};

export const confirmTransfer = async (
  payload: {
    toPhoneNumber: string;
    amount: number;
    remark?: string;
    pin: string;
  },
  idempotencyKey?: string
) => {
  try {
    const data = idempotencyKey
      ? { ...payload, idempotencyKey }
      : payload;
    const config = idempotencyKey
      ? { headers: { "Idempotency-Key": idempotencyKey } }
      : undefined;

    const response = await axios.post(API.TRANSACTIONS.CONFIRM, data, config);
    return response.data;
  } catch (error: any) {
    throwApiError(error, "Confirm transfer failed");
  }
};

export const getTransactionHistory = async ({
  page = 1,
  limit = 10,
  search = "",
  direction = "all",
}: GetTransactionHistoryParams = {}) => {
  try {
    const response = await axios.get(API.TRANSACTIONS.LIST, {
      params: { page, limit, search, direction },
    });
    return response.data;
  } catch (error: any) {
    throwApiError(error, "Get transaction history failed");
  }
};

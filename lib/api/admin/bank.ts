import axios from "../axios";
import { API } from "../endpoints";
import type {
  AdminBank,
  AdminBankApiError,
  CreateBankPayload,
  UpdateBankPayload,
} from "@/lib/types/admin-bank";

type ApiResponse<T> = {
  success?: boolean;
  status?: "success" | "error";
  code?: string;
  message?: string;
  data: T;
};

type DeleteResponse = {
  success?: boolean;
  status?: "success" | "error";
  code?: string;
  message?: string;
};

const normalizeError = (error: unknown, fallback: string): AdminBankApiError => {
  const err = error as {
    message?: string;
    response?: {
      status?: number;
      data?: {
        message?: string;
        code?: string;
        data?: unknown;
      };
    };
  };

  return {
    message: err.response?.data?.message || err.message || fallback,
    status: err.response?.status,
    code: err.response?.data?.code,
    details: err.response?.data?.data,
  };
};

export const createBank = async (
  payload: CreateBankPayload,
): Promise<ApiResponse<AdminBank>> => {
  try {
    const response = await axios.post<ApiResponse<AdminBank>>(
      API.ADMIN.BANK.CREATE,
      payload,
    );
    return response.data;
  } catch (error) {
    throw normalizeError(error, "Create bank failed");
  }
};

export const getAllBanks = async (): Promise<ApiResponse<AdminBank[]>> => {
  try {
    const response = await axios.get<ApiResponse<AdminBank[]>>(
      API.ADMIN.BANK.READALL,
    );
    return response.data;
  } catch (error) {
    throw normalizeError(error, "Get all banks failed");
  }
};

export const updateOneBank = async (
  id: string,
  payload: UpdateBankPayload,
): Promise<ApiResponse<AdminBank>> => {
  try {
    const endpoint = API.ADMIN.BANK.UPDATE.replace(":id", id);
    const response = await axios.put<ApiResponse<AdminBank>>(endpoint, payload);
    return response.data;
  } catch (error) {
    throw normalizeError(error, "Update bank failed");
  }
};

export const deleteOneBank = async (id: string): Promise<DeleteResponse> => {
  try {
    const endpoint = API.ADMIN.BANK.DELETE.replace(":id", id);
    const response = await axios.delete(endpoint);

    if (response.status === 204) {
      return {
        success: true,
        status: "success",
        message: "Bank deleted successfully",
      };
    }

    return response.data as DeleteResponse;
  } catch (error) {
    throw normalizeError(error, "Delete bank failed");
  }
};

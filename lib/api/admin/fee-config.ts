import axios from "../axios";
import { API } from "../endpoints";
import type {
  AdminFeeConfig,
  AdminFeeConfigApiError,
  CreateFeeConfigPayload,
  FeeConfigListQuery,
  UpdateFeeConfigPayload,
} from "@/lib/types/admin-fee-config";
import type { AdminListResponse } from "@/lib/types/admin-services";

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

const normalizeError = (
  error: unknown,
  fallback: string,
): AdminFeeConfigApiError => {
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

export const createFeeConfig = async (
  payload: CreateFeeConfigPayload,
): Promise<ApiResponse<AdminFeeConfig>> => {
  try {
    const response = await axios.post<ApiResponse<AdminFeeConfig>>(
      API.ADMIN.FEE_CONFIG.CREATE,
      payload,
    );
    return response.data;
  } catch (error) {
    throw normalizeError(error, "Create fee config failed");
  }
};

export const getAllFeeConfigs = async (
  query: FeeConfigListQuery = {},
): Promise<ApiResponse<AdminListResponse<AdminFeeConfig>>> => {
  try {
    const response = await axios.get<
      ApiResponse<AdminListResponse<AdminFeeConfig>>
    >(API.ADMIN.FEE_CONFIG.READALL, { params: query });
    return response.data;
  } catch (error) {
    throw normalizeError(error, "Get fee configs failed");
  }
};

export const getOneFeeConfig = async (
  id: string,
): Promise<ApiResponse<AdminFeeConfig>> => {
  try {
    const endpoint = API.ADMIN.FEE_CONFIG.READONE.replace(":id", id);
    const response = await axios.get<ApiResponse<AdminFeeConfig>>(endpoint);
    return response.data;
  } catch (error) {
    throw normalizeError(error, "Get fee config failed");
  }
};

export const updateOneFeeConfig = async (
  id: string,
  payload: UpdateFeeConfigPayload,
): Promise<ApiResponse<AdminFeeConfig>> => {
  try {
    const endpoint = API.ADMIN.FEE_CONFIG.UPDATE.replace(":id", id);
    const response = await axios.put<ApiResponse<AdminFeeConfig>>(
      endpoint,
      payload,
    );
    return response.data;
  } catch (error) {
    throw normalizeError(error, "Update fee config failed");
  }
};

export const deleteOneFeeConfig = async (
  id: string,
): Promise<DeleteResponse> => {
  try {
    const endpoint = API.ADMIN.FEE_CONFIG.DELETE.replace(":id", id);
    const response = await axios.delete(endpoint);

    if (response.status === 204) {
      return {
        success: true,
        status: "success",
        message: "Fee config deleted successfully",
      };
    }

    return response.data as DeleteResponse;
  } catch (error) {
    throw normalizeError(error, "Delete fee config failed");
  }
};

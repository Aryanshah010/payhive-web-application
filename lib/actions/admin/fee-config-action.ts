"use server";

import { revalidatePath } from "next/cache";
import {
  createFeeConfig,
  deleteOneFeeConfig,
  getAllFeeConfigs,
  getOneFeeConfig,
  updateOneFeeConfig,
} from "@/lib/api/admin/fee-config";
import type {
  AdminFeeConfigApiError,
  CreateFeeConfigPayload,
  FeeConfigListQuery,
  UpdateFeeConfigPayload,
} from "@/lib/types/admin-fee-config";

const FEE_CONFIG_REVALIDATE_PATHS = [
  "/admin/monetization",
  "/admin/monetization/create",
] as const;

const isSuccessResponse = (response: { success?: boolean; status?: string }) =>
  response.success === true || response.status === "success";

const revalidateFeeConfigPaths = () => {
  FEE_CONFIG_REVALIDATE_PATHS.forEach((path) => revalidatePath(path));
};

const normalizeActionError = (error: unknown, fallback: string) => {
  const err = error as AdminFeeConfigApiError;
  return {
    success: false as const,
    message: err.message || fallback,
    status: err.status,
    code: err.code,
    details: err.details,
  };
};

export const handleCreateFeeConfig = async (
  payload: CreateFeeConfigPayload,
) => {
  try {
    const response = await createFeeConfig(payload);

    if (isSuccessResponse(response)) {
      revalidateFeeConfigPaths();
      return {
        success: true,
        message: response.message || "Fee config created successfully",
        data: response.data,
      };
    }

    return {
      success: false,
      message: response.message || "Create fee config failed",
      code: response.code,
    };
  } catch (error) {
    return normalizeActionError(error, "Create fee config action failed");
  }
};

export const handleGetAllFeeConfigs = async (
  query: FeeConfigListQuery = {},
) => {
  try {
    const response = await getAllFeeConfigs(query);

    if (isSuccessResponse(response)) {
      return {
        success: true,
        message: response.message || "Fee configs fetched successfully",
        data: response.data,
      };
    }

    return {
      success: false,
      message: response.message || "Get fee configs failed",
      data: undefined,
      code: response.code,
    };
  } catch (error) {
    return normalizeActionError(error, "Get fee configs action failed");
  }
};

export const handleGetOneFeeConfig = async (id: string) => {
  try {
    const response = await getOneFeeConfig(id);

    if (isSuccessResponse(response)) {
      return {
        success: true,
        message: response.message || "Fee config fetched successfully",
        data: response.data,
      };
    }

    return {
      success: false,
      message: response.message || "Get fee config failed",
      code: response.code,
    };
  } catch (error) {
    return normalizeActionError(error, "Get fee config action failed");
  }
};

export const handleUpdateOneFeeConfig = async (
  id: string,
  payload: UpdateFeeConfigPayload,
) => {
  try {
    const response = await updateOneFeeConfig(id, payload);

    if (isSuccessResponse(response)) {
      revalidateFeeConfigPaths();
      revalidatePath(`/admin/monetization/${id}`);
      revalidatePath(`/admin/monetization/${id}/edit`);
      return {
        success: true,
        message: response.message || "Fee config updated successfully",
        data: response.data,
      };
    }

    return {
      success: false,
      message: response.message || "Update fee config failed",
      code: response.code,
    };
  } catch (error) {
    return normalizeActionError(error, "Update fee config action failed");
  }
};

export const handleDeleteOneFeeConfig = async (id: string) => {
  try {
    const response = await deleteOneFeeConfig(id);

    if (isSuccessResponse(response)) {
      revalidateFeeConfigPaths();
      return {
        success: true,
        message: response.message || "Fee config deleted successfully",
      };
    }

    return {
      success: false,
      message: response.message || "Delete fee config failed",
      code: response.code,
    };
  } catch (error) {
    return normalizeActionError(error, "Delete fee config action failed");
  }
};

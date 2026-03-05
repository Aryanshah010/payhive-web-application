"use server";

import { revalidatePath } from "next/cache";
import {
  createBank,
  deleteOneBank,
  getAllBanks,
  updateOneBank,
} from "@/lib/api/admin/bank";
import type {
  AdminBankApiError,
  CreateBankPayload,
  UpdateBankPayload,
} from "@/lib/types/admin-bank";

type ApiStatus = {
  success?: boolean;
  status?: "success" | "error";
};

const BANK_REVALIDATE_PATHS = ["/admin/banks", "/admin/banks/create"] as const;

const isSuccessResponse = (response: ApiStatus) =>
  response.success === true || response.status === "success";

const revalidateBankPaths = () => {
  BANK_REVALIDATE_PATHS.forEach((path) => revalidatePath(path));
};

const normalizeActionError = (error: unknown, fallback: string) => {
  const err = error as AdminBankApiError;
  return {
    success: false as const,
    message: err.message || fallback,
    status: err.status,
    code: err.code,
    details: err.details,
  };
};

export const handleCreateBank = async (payload: CreateBankPayload) => {
  try {
    const response = await createBank(payload);
    if (isSuccessResponse(response)) {
      revalidateBankPaths();
      return {
        success: true,
        message: response.message || "Bank created successfully",
        data: response.data,
      };
    }

    return {
      success: false,
      message: response.message || "Create bank failed",
      code: response.code,
    };
  } catch (error) {
    return normalizeActionError(error, "Create bank action failed");
  }
};

export const handleGetAllBanks = async () => {
  try {
    const response = await getAllBanks();
    if (isSuccessResponse(response)) {
      return {
        success: true,
        message: response.message || "Banks fetched successfully",
        data: response.data,
      };
    }

    return {
      success: false,
      message: response.message || "Get all banks failed",
      data: [],
      code: response.code,
    };
  } catch (error) {
    return normalizeActionError(error, "Get all banks action failed");
  }
};

export const handleGetOneBank = async (id: string) => {
  try {
    const response = await getAllBanks();

    if (!isSuccessResponse(response)) {
      return {
        success: false,
        message: response.message || "Get bank failed",
        code: response.code,
      };
    }

    const bank = response.data.find((item) => item._id === id);
    if (!bank) {
      return {
        success: false,
        message: "Bank not found",
        code: "NOT_FOUND",
      };
    }

    return {
      success: true,
      message: "Bank fetched successfully",
      data: bank,
    };
  } catch (error) {
    return normalizeActionError(error, "Get bank action failed");
  }
};

export const handleUpdateOneBank = async (
  id: string,
  payload: UpdateBankPayload,
) => {
  try {
    const response = await updateOneBank(id, payload);
    if (isSuccessResponse(response)) {
      revalidateBankPaths();
      revalidatePath(`/admin/banks/${id}`);
      revalidatePath(`/admin/banks/${id}/edit`);

      return {
        success: true,
        message: response.message || "Bank updated successfully",
        data: response.data,
      };
    }

    return {
      success: false,
      message: response.message || "Update bank failed",
      code: response.code,
    };
  } catch (error) {
    return normalizeActionError(error, "Update bank action failed");
  }
};

export const handleDeleteOneBank = async (id: string) => {
  try {
    const response = await deleteOneBank(id);
    if (isSuccessResponse(response)) {
      revalidateBankPaths();
      return {
        success: true,
        message: response.message || "Bank deleted successfully",
      };
    }

    return {
      success: false,
      message: response.message || "Delete bank failed",
      code: response.code,
    };
  } catch (error) {
    return normalizeActionError(error, "Delete bank action failed");
  }
};

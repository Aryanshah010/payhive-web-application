/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";
import {
  lookupBeneficiary,
  previewTransfer,
  confirmTransfer,
} from "@/lib/api/transaction";

export async function handleLookupBeneficiary(phoneNumber: string) {
  try {
    const result = await lookupBeneficiary(phoneNumber);
    if (result.success) {
      return { success: true, data: result.data, message: result.message };
    }
    return {
      success: false,
      message: result.message || "Lookup beneficiary failed",
    };
  } catch (error: Error | any) {
    return {
      success: false,
      message: error.message || "Lookup beneficiary failed",
      details: error.details,
      status: error.status,
    };
  }
}

export async function handlePreviewTransfer(payload: {
  toPhoneNumber: string;
  amount: number;
  remark?: string;
}) {
  try {
    const result = await previewTransfer(payload);
    if (result.success) {
      return { success: true, data: result.data, message: result.message };
    }
    return {
      success: false,
      message: result.message || "Preview transfer failed",
    };
  } catch (error: Error | any) {
    return {
      success: false,
      message: error.message || "Preview transfer failed",
      details: error.details,
      status: error.status,
    };
  }
}

export async function handleConfirmTransfer(
  payload: {
    toPhoneNumber: string;
    amount: number;
    remark?: string;
    pin: string;
  },
  idempotencyKey?: string
) {
  try {
    const result = await confirmTransfer(payload, idempotencyKey);
    if (result.success) {
      return { success: true, data: result.data, message: result.message };
    }
    return {
      success: false,
      message: result.message || "Confirm transfer failed",
    };
  } catch (error: Error | any) {
    return {
      success: false,
      message: error.message || "Confirm transfer failed",
      details: error.details,
      status: error.status,
    };
  }
}

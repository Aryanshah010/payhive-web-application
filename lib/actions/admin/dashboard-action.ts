"use server";

import { getDashboardMetrics } from "@/lib/api/admin/dashboard";
import type { AdminDashboardStats, DashboardRange } from "@/lib/admin/dashboard-stats";

type DashboardActionSuccess = {
  success: true;
  data: AdminDashboardStats;
  message?: string;
};

type DashboardActionFailure = {
  success: false;
  message: string;
  status?: number;
  details?: unknown;
};

export const handleGetDashboardMetrics = async (
  range: DashboardRange = "6m",
): Promise<DashboardActionSuccess | DashboardActionFailure> => {
  try {
    const response = await getDashboardMetrics(range);
    if (response.success) {
      return {
        success: true,
        data: response.data,
        message: response.message,
      };
    }

    return {
      success: false,
      message: response.message || "Get dashboard metrics failed",
    };
  } catch (error) {
    const err = error as {
      message?: string;
      status?: number;
      details?: unknown;
    };

    return {
      success: false,
      message: err.message || "Get dashboard metrics failed",
      status: err.status,
      details: err.details,
    };
  }
};

/* eslint-disable @typescript-eslint/no-explicit-any */

import axios from "../axios";
import type { AdminDashboardStats, DashboardRange } from "@/lib/admin/dashboard-stats";

type ApiResponse<T> = {
    success: boolean;
    message?: string;
    data: T;
};

type ApiError = Error & { status?: number; details?: unknown };

const throwApiError = (error: any, fallback: string) => {
    const message = error.response?.data?.message || error.message || fallback;
    const err: ApiError = new Error(message);
    err.details = error.response?.data?.data;
    err.status = error.response?.status;
    throw err;
};

export const getDashboardMetrics = async (range: DashboardRange = "6m") => {
    try {
        const response = await axios.get<ApiResponse<AdminDashboardStats>>("/api/admin/dashboard", {
            params: { range },
        });
        return response.data;
    } catch (error: any) {
        throwApiError(error, "Failed to fetch dashboard metrics");
    }
};

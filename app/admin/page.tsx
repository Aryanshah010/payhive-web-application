import AdminDashboard from "./_components/AdminDashboard";
import { createEmptyAdminDashboardStats } from "@/lib/admin/dashboard-stats";
import { handleGetDashboardMetrics } from "@/lib/actions/admin/dashboard-action";

export default async function Page() {
  const result = await handleGetDashboardMetrics("6m");
  const dashboardData =
    result.success && result.data
      ? result.data
      : createEmptyAdminDashboardStats();

  return <AdminDashboard initialData={dashboardData} />;
}

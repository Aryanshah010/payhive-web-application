import AdminDashboard from "./_components/AdminDashboard";
import { getAdminDashboardStats } from "@/lib/admin/dashboard-stats";

export default async function Page() {
  const stats = await getAdminDashboardStats();

  return <AdminDashboard stats={stats} />;
}

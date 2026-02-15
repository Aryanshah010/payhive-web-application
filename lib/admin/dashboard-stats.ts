import { getAllUsers } from "@/lib/api/admin/user";

export type AdminDashboardStats = {
  generatedAt: string;
  currency: "NPR";
  kpis: {
    totalUsers: number;
    totalTransactions: number;
    totalRevenue: number;
    avgRevenuePerTransaction: number;
    activeServices: number;
  };
  monthlySeries: Array<{
    monthLabel: string;
    revenue: number;
    transactions: number;
  }>;
  monetizationStatus: {
    source: "mock";
    backendReady: boolean;
    summary: string;
    nextStep: string;
  };
};

const MOCK_MONTHLY_SERIES: AdminDashboardStats["monthlySeries"] = [
  { monthLabel: "Sep", revenue: 38200, transactions: 710 },
  { monthLabel: "Oct", revenue: 42950, transactions: 790 },
  { monthLabel: "Nov", revenue: 46300, transactions: 840 },
  { monthLabel: "Dec", revenue: 51840, transactions: 920 },
  { monthLabel: "Jan", revenue: 57420, transactions: 1010 },
  { monthLabel: "Feb", revenue: 61110, transactions: 1095 },
];

async function getTotalUsers(): Promise<number> {
  try {
    const response = await getAllUsers(1, 1, "", "");
    if (response?.success && response?.data?.total) {
      return Number(response.data.total) || 0;
    }
  } catch (error) {
    console.error("Failed to load total users for admin dashboard", error);
  }

  return 0;
}

export async function getAdminDashboardStats(): Promise<AdminDashboardStats> {
  const totalUsers = await getTotalUsers();
  const totalTransactions = MOCK_MONTHLY_SERIES.reduce(
    (sum, item) => sum + item.transactions,
    0,
  );
  const totalRevenue = MOCK_MONTHLY_SERIES.reduce(
    (sum, item) => sum + item.revenue,
    0,
  );

  return {
    generatedAt: new Date().toISOString(),
    currency: "NPR",
    kpis: {
      totalUsers,
      totalTransactions,
      totalRevenue,
      avgRevenuePerTransaction:
        totalTransactions > 0 ? totalRevenue / totalTransactions : 0,
      activeServices: 4,
    },
    monthlySeries: MOCK_MONTHLY_SERIES,
    monetizationStatus: {
      source: "mock",
      backendReady: false,
      summary:
        "Revenue and transaction monetization metrics are currently mock values.",
      nextStep:
        "Replace mock series with backend analytics generated from Flutter transaction events.",
    },
  };
}

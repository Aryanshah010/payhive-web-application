export type DashboardRange = '6m' | '30d' | '90d';

export type AdminDashboardStats = {
  generatedAt: string;
  currency: 'NPR';
  kpis: {
    totalUsers: number;
    totalTransactions: number;
    totalTransactionAmount: number;
    totalRevenue: number;
    avgRevenuePerTransaction: number;
  };
  monthlySeries: Array<{
    monthLabel: string;
    month?: number;
    year?: number;
    revenue: number;
    transactions: number;
  }>;
};

export const createEmptyAdminDashboardStats = (): AdminDashboardStats => ({
  generatedAt: new Date().toISOString(),
  currency: 'NPR',
  kpis: {
    totalUsers: 0,
    totalTransactions: 0,
    totalTransactionAmount: 0,
    totalRevenue: 0,
    avgRevenuePerTransaction: 0,
  },
  monthlySeries: [],
});

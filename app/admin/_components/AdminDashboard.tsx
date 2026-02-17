"use client";

import { Bar, CartesianGrid, ComposedChart, Line, XAxis, YAxis } from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import type { AdminDashboardStats } from "@/lib/admin/dashboard-stats";

type KpiCardProps = {
  title: string;
  value: string;
  description: string;
};

function KpiCard({ title, value, description }: KpiCardProps) {
  return (
    <Card className="border-border/70">
      <CardHeader className="pb-2">
        <CardDescription>{title}</CardDescription>
        <CardTitle className="text-xl sm:text-2xl">{value}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-xs text-muted-foreground">{description}</p>
      </CardContent>
    </Card>
  );
}

export default function AdminDashboard({ stats }: { stats: AdminDashboardStats }) {
  const currencyFormatter = new Intl.NumberFormat("en-NP", {
    style: "currency",
    currency: stats.currency,
    maximumFractionDigits: 0,
  });
  const numberFormatter = new Intl.NumberFormat("en-NP");

  const chartConfig = {
    revenue: {
      label: "Revenue (NPR)",
      color: "var(--chart-2)",
    },
    transactions: {
      label: "Transactions",
      color: "var(--chart-1)",
    },
  };

  return (
    <div className="space-y-4">
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
        <KpiCard
          title="Total Users"
          value={numberFormatter.format(stats.kpis.totalUsers)}
          description="Live count from users API"
        />
        <KpiCard
          title="Total Transactions"
          value={numberFormatter.format(stats.kpis.totalTransactions)}
          description=""
        />
        <KpiCard
          title="Total Transaction Amount (NPR)"
          value={currencyFormatter.format(stats.kpis.totalRevenue)}
          description="Mock monetization revenue from mobile app"
        />
        <KpiCard
          title="Avg Revenue / Tx"
          value={currencyFormatter.format(stats.kpis.avgRevenuePerTransaction)}
          description="Derived average based on mock revenue + transactions"
        />
      </div>

      <div className="grid gap-4 xl:grid-cols-3">
        <Card className="xl:col-span-2 border-border/70">
          <CardHeader className="space-y-2">
            <div className="flex items-center justify-between gap-2">
              <div>
                <CardTitle>Revenue & Transactions</CardTitle>
                <CardDescription>Monthly trend overview (mock data)</CardDescription>
              </div>
              <Badge variant="outline">NPR</Badge>
            </div>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="h-70">
              <ComposedChart data={stats.monthlySeries}>
                <CartesianGrid vertical={false} />
                <XAxis
                  dataKey="monthLabel"
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                />
                <YAxis
                  yAxisId="left"
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(value) =>
                    currencyFormatter.format(Number(value)).replace(".00", "")
                  }
                  width={88}
                />
                <YAxis
                  yAxisId="right"
                  orientation="right"
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(value) => numberFormatter.format(Number(value))}
                  width={56}
                />
                <ChartTooltip
                  cursor={false}
                  content={
                    <ChartTooltipContent
                      formatter={(value, name) => {
                        if (name === "revenue") {
                          return currencyFormatter.format(Number(value));
                        }
                        return numberFormatter.format(Number(value));
                      }}
                    />
                  }
                />
                <Bar
                  yAxisId="right"
                  dataKey="transactions"
                  fill="var(--color-transactions)"
                  fillOpacity={0.35}
                  radius={[6, 6, 0, 0]}
                />
                <Line
                  yAxisId="left"
                  type="monotone"
                  dataKey="revenue"
                  stroke="var(--color-revenue)"
                  strokeWidth={2.5}
                  dot={{ fill: "var(--color-revenue)", r: 3 }}
                  activeDot={{ r: 5 }}
                />
              </ComposedChart>
            </ChartContainer>
          </CardContent>
        </Card>

      </div>
    </div>
  );
}

'use client';

import { useState, useCallback } from 'react';
import { RefreshCw } from 'lucide-react';
import { Bar, CartesianGrid, ComposedChart, Line, XAxis, YAxis, ResponsiveContainer } from 'recharts';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import type { AdminDashboardStats } from '@/lib/admin/dashboard-stats';
import { handleGetDashboardMetrics } from '@/lib/actions/admin/dashboard-action';

type KpiCardProps = {
    title: string;
    value: string;
    description?: string;
    badge?: string;
};

function KpiCard({ title, value, description, badge }: KpiCardProps) {
    return (
        <Card className="border-border/70">
            <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                    <CardDescription>{title}</CardDescription>
                    {badge && <Badge variant="secondary" className="text-xs">{badge}</Badge>}
                </div>
                <CardTitle className="text-xl sm:text-2xl">{value}</CardTitle>
            </CardHeader>
            {description && (
                <CardContent>
                    <p className="text-xs text-muted-foreground">{description}</p>
                </CardContent>
            )}
        </Card>
    );
}

export default function AdminDashboard({ initialData }: { initialData: AdminDashboardStats }) {
    const [stats, setStats] = useState<AdminDashboardStats>(initialData);
    const [isLoading, setIsLoading] = useState(false);
    const [lastUpdated, setLastUpdated] = useState<Date>(new Date(initialData.generatedAt));

    const handleRefresh = useCallback(async () => {
        setIsLoading(true);
        try {
            const result = await handleGetDashboardMetrics('6m');
            if (result.success) {
                setStats(result.data);
                setLastUpdated(new Date(result.data.generatedAt));
            }
        } catch (error) {
            console.error('Failed to refresh dashboard:', error);
        } finally {
            setIsLoading(false);
        }
    }, []);

    const getTimeAgo = (date: Date): string => {
        const now = new Date();
        const diff = Math.floor((now.getTime() - date.getTime()) / 1000);

        if (diff < 60) return 'Just now';
        if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
        if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
        return `${Math.floor(diff / 86400)}d ago`;
    };

    const currencyFormatter = new Intl.NumberFormat('en-NP', {
        style: 'currency',
        currency: stats.currency,
        maximumFractionDigits: 0,
    });

    const numberFormatter = new Intl.NumberFormat('en-NP', {
        maximumFractionDigits: 0,
    });

    const chartConfig = {
        revenue: {
            label: 'Revenue (NPR)',
            color: 'var(--chart-2)',
        },
        transactions: {
            label: 'Transactions',
            color: 'var(--chart-1)',
        },
    };

    return (
        <div className="space-y-6">
            {/* Header with Refresh */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
                    <p className="text-sm text-muted-foreground mt-1">
                        Last updated {getTimeAgo(lastUpdated)}
                    </p>
                </div>
                <Button
                    onClick={handleRefresh}
                    disabled={isLoading}
                    variant="outline"
                    size="sm"
                    className="gap-2"
                >
                    <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
                    {isLoading ? 'Refreshing...' : 'Refresh'}
                </Button>
            </div>

            {/* KPI Cards */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
                <KpiCard
                    title="Total Users"
                    value={numberFormatter.format(stats.kpis.totalUsers)}
                />
                <KpiCard
                    title="Total Transactions"
                    value={numberFormatter.format(stats.kpis.totalTransactions)}
                />
                <KpiCard
                    title="Total Transaction Amount (NPR)"
                    value={currencyFormatter.format(stats.kpis.totalTransactionAmount)}
                    badge="NPR"
                />
                <KpiCard
                    title="Total Revenue"
                    value={currencyFormatter.format(stats.kpis.totalRevenue)}
                    badge="NPR"
                />
                <KpiCard
                    title="Avg Revenue / Tx"
                    value={currencyFormatter.format(stats.kpis.avgRevenuePerTransaction)}
                    badge="NPR"
                />
            </div>

            {/* Revenue Chart */}
            <Card className="border-border/70">
                <CardHeader className="space-y-2">
                    <div className="flex items-center justify-between gap-2">
                        <div>
                            <CardTitle>Revenue & Transactions</CardTitle>
                            <CardDescription>Last 6 months</CardDescription>
                        </div>
                        <Badge variant="outline">NPR</Badge>
                    </div>
                </CardHeader>
                <CardContent>
                    <ChartContainer config={chartConfig} className="h-80">
                        <ResponsiveContainer width="100%" height="100%">
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
                                        currencyFormatter.format(Number(value)).replace(/\.00/, '')
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
                                                if (name === 'revenue') {
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
                                    dot={{ fill: 'var(--color-revenue)', r: 3 }}
                                    activeDot={{ r: 5 }}
                                />
                            </ComposedChart>
                        </ResponsiveContainer>
                    </ChartContainer>
                </CardContent>
            </Card>
        </div>
    );
}

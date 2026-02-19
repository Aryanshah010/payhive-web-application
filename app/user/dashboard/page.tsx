import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowUpRight, Wallet } from "lucide-react";
import { handleWhoAmI } from "@/lib/actions/user-action";
import { handleGetTransactionHistory } from "@/lib/actions/transaction-action";
import TransactionHistorySection from "./_components/TransactionHistorySection";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const formatCurrency = (value: number) =>
  new Intl.NumberFormat("en-NP", {
    style: "currency",
    currency: "NPR",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);

export const dynamic = "force-dynamic";

export default async function UserDashboardPage() {
  const perPageLimit = 8;
  const [userResult, historyResult] = await Promise.all([
    handleWhoAmI(),
    handleGetTransactionHistory({ page: 1, limit: perPageLimit, direction: "all" }),
  ]);

  if (!userResult.success) {
    throw new Error(userResult.message || "Error fetching user data");
  }

  if (!userResult.data) {
    notFound();
  }

  const initialHistoryData = historyResult.success ? historyResult.data : null;
  const initialHistoryError = historyResult.success
    ? null
    : historyResult.message || "Failed to fetch transactions";
  const balance = Number(userResult.data.balance || 0);

  return (
    <div className="space-y-4">
      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="border-border/70 lg:col-span-2">
          <CardHeader>
            <div className="flex items-center justify-between gap-3">
              <div>
                <CardDescription>Current Wallet Balance</CardDescription>
                <CardTitle className="mt-1 flex items-center gap-2 text-2xl sm:text-3xl">
                  <Wallet className="size-5 text-muted-foreground" />
                  {formatCurrency(balance)}
                </CardTitle>
              </div>
              <Badge variant="outline">NPR</Badge>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">
              Available amount for transfers and service payments.
            </p>
          </CardContent>
        </Card>

        <Card className="border-border/70">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Shortcuts for your most-used pages</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-2">
            <Button asChild>
              <Link href="/user/send-money" className="justify-between">
                Send Money
                <ArrowUpRight className="size-4" />
              </Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/user/profile" className="justify-between">
                Update Profile
                <ArrowUpRight className="size-4" />
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>

      <TransactionHistorySection
        initialData={initialHistoryData}
        initialError={initialHistoryError}
        limit={perPageLimit}
      />
    </div>
  );
}

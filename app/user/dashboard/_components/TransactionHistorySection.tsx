"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { getTransactionHistory } from "@/lib/api/transaction";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";

type UserRef = {
  fullName?: string;
  phoneNumber?: string;
};

type TransactionHistoryItem = {
  txId: string;
  status: string;
  amount: number;
  remark?: string;
  from: UserRef;
  to: UserRef;
  createdAt: string;
  direction: "DEBIT" | "CREDIT";
};

type TransactionHistoryData = {
  items: TransactionHistoryItem[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
};

type TransactionHistorySectionProps = {
  initialData?: TransactionHistoryData | null;
  initialError?: string | null;
  limit?: number;
};

const formatCurrency = (value: number) =>
  new Intl.NumberFormat("en-NP", {
    style: "currency",
    currency: "NPR",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);

const formatDateTime = (value?: string) => {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "—";
  return new Intl.DateTimeFormat("en-US", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
};

export default function TransactionHistorySection({
  initialData = null,
  initialError = null,
  limit = 8,
}: TransactionHistorySectionProps) {
  const [transactions, setTransactions] = useState<TransactionHistoryItem[]>(
    initialData?.items || [],
  );
  const [total, setTotal] = useState<number>(initialData?.total || 0);
  const [page, setPage] = useState<number>(initialData?.page || 1);
  const [totalPages, setTotalPages] = useState<number>(
    Math.max(1, initialData?.totalPages || 1),
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(initialError);

  const fetchPage = useCallback(
    async (nextPage: number) => {
      setLoading(true);
      setError(null);

      try {
        const response = await getTransactionHistory({
          page: nextPage,
          limit,
          direction: "all",
        });

        if (!response.success) {
          setError(response.message || "Failed to fetch transactions");
          return;
        }

        const data = response.data as TransactionHistoryData;
        setTransactions(data?.items || []);
        setTotal(data?.total || 0);
        setPage(data?.page || nextPage);
        setTotalPages(Math.max(1, data?.totalPages || 1));
      } catch (err: unknown) {
        const message =
          err instanceof Error ? err.message : "Failed to fetch transactions";
        setError(message);
      } finally {
        setLoading(false);
      }
    },
    [limit],
  );

  useEffect(() => {
    if (!initialData) {
      void fetchPage(1);
    }
  }, [initialData, fetchPage]);

  const goToPage = (nextPage: number) => {
    const clamped = Math.min(Math.max(1, nextPage), totalPages);
    if (clamped === page || loading) return;
    void fetchPage(clamped);
  };

  const pageNumbers = useMemo(() => {
    const visiblePages = Math.min(5, totalPages);
    const half = Math.floor(visiblePages / 2);
    let start = Math.max(1, page - half);

    if (start + visiblePages - 1 > totalPages) {
      start = Math.max(1, totalPages - visiblePages + 1);
    }

    return Array.from({ length: visiblePages }, (_, i) => start + i);
  }, [page, totalPages]);

  return (
    <Card className="border-border/70">
      <CardHeader>
        <CardTitle>Transactions</CardTitle>
        <CardDescription>Showing {limit} transactions per page</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        {error ? (
          <div className="rounded-md border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">
            {error}
          </div>
        ) : null}

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Type</TableHead>
              <TableHead>Counterparty</TableHead>
              <TableHead>Remark</TableHead>
              <TableHead className="text-right">Amount</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={6} className="py-8 text-center text-muted-foreground">
                  Loading transactions...
                </TableCell>
              </TableRow>
            ) : transactions.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="py-8 text-center text-muted-foreground">
                  No transactions yet.
                </TableCell>
              </TableRow>
            ) : (
              transactions.map((item) => {
                const isDebit = item.direction === "DEBIT";
                const counterparty = isDebit ? item.to : item.from;
                const counterpartyName =
                  counterparty.fullName || counterparty.phoneNumber || "PayHive User";

                const statusClass =
                  item.status === "SUCCESS"
                    ? "text-emerald-700 dark:text-emerald-400"
                    : item.status === "FAILED"
                      ? "text-destructive"
                      : "text-amber-700 dark:text-amber-400";

                return (
                  <TableRow key={item.txId}>
                    <TableCell>
                      <Badge variant={isDebit ? "outline" : "secondary"}>
                        {isDebit ? "Sent" : "Received"}
                      </Badge>
                    </TableCell>

                    <TableCell className="whitespace-normal">
                      <div className="font-medium">{counterpartyName}</div>
                      <p className="text-xs text-muted-foreground">
                        {counterparty.phoneNumber || "—"}
                      </p>
                    </TableCell>

                    <TableCell className="max-w-64 whitespace-normal text-muted-foreground">
                      {item.remark || "—"}
                    </TableCell>

                    <TableCell
                      className={cn(
                        "text-right font-medium",
                        isDebit ? "text-destructive" : "text-emerald-700 dark:text-emerald-400",
                      )}
                    >
                      {isDebit ? "-" : "+"}
                      {formatCurrency(item.amount)}
                    </TableCell>

                    <TableCell>{formatDateTime(item.createdAt)}</TableCell>

                    <TableCell>
                      <Badge variant="outline" className={statusClass}>
                        {item.status}
                      </Badge>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>

        <div className="mt-4 flex items-center justify-between">
          <p className="text-sm text-muted-foreground">Total Transactions: {total}</p>

          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  onClick={() => goToPage(page - 1)}
                  className={page === 1 || loading ? "pointer-events-none opacity-50" : ""}
                />
              </PaginationItem>

              {pageNumbers.map((pageNumber) => (
                <PaginationItem key={pageNumber}>
                  <PaginationLink
                    isActive={pageNumber === page}
                    onClick={() => goToPage(pageNumber)}
                  >
                    {pageNumber}
                  </PaginationLink>
                </PaginationItem>
              ))}

              <PaginationItem>
                <PaginationNext
                  onClick={() => goToPage(page + 1)}
                  className={
                    page === totalPages || loading ? "pointer-events-none opacity-50" : ""
                  }
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      </CardContent>
    </Card>
  );
}

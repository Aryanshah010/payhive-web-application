"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import { getAllBanks } from "@/lib/api/admin/bank";
import { handleDeleteOneBank } from "@/lib/actions/admin/bank-action";
import type { AdminBank } from "@/lib/types/admin-bank";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { MoreVertical, Eye, Pencil, Search, Trash2 } from "lucide-react";
import { toast } from "react-toastify";

type StatusFilter = "all" | "active" | "inactive";

const formatDateTime = (value?: string | Date | null) => {
  if (!value) return "—";

  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) return "—";

  return new Intl.DateTimeFormat("en-US", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
};

const formatAmount = (value: number) =>
  new Intl.NumberFormat("en-NP", {
    style: "currency",
    currency: "NPR",
    maximumFractionDigits: 2,
  }).format(value);

const isSuccessResponse = (response: { success?: boolean; status?: string }) =>
  response.success === true || response.status === "success";

export default function BanksTable() {
  const [banks, setBanks] = useState<AdminBank[]>([]);
  const [loading, setLoading] = useState(true);

  const [page, setPage] = useState(1);
  const limit = 10;

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");

  const [deleteBankId, setDeleteBankId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchBanks = useCallback(async () => {
    setLoading(true);

    try {
      const response = await getAllBanks();
      if (isSuccessResponse(response)) {
        setBanks(response.data || []);
      } else {
        setBanks([]);
      }
    } catch (error) {
      const err = error as { message?: string };
      toast.error(err.message || "Failed to fetch banks");
      setBanks([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchBanks();
  }, [fetchBanks]);

  const filteredBanks = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();

    return banks.filter((bank) => {
      const matchesSearch =
        normalizedSearch.length === 0 ||
        bank.name.toLowerCase().includes(normalizedSearch) ||
        bank.code.toLowerCase().includes(normalizedSearch);

      const matchesStatus =
        statusFilter === "all" ||
        (statusFilter === "active" && bank.isActive) ||
        (statusFilter === "inactive" && !bank.isActive);

      return matchesSearch && matchesStatus;
    });
  }, [banks, search, statusFilter]);

  const total = filteredBanks.length;
  const totalPages = Math.max(1, Math.ceil(total / limit));

  useEffect(() => {
    if (page > totalPages) {
      setPage(totalPages);
    }
  }, [page, totalPages]);

  const paginatedBanks = useMemo(() => {
    const start = (page - 1) * limit;
    return filteredBanks.slice(start, start + limit);
  }, [filteredBanks, page]);

  const handleDelete = async () => {
    if (!deleteBankId) return;

    setIsDeleting(true);
    try {
      const response = await handleDeleteOneBank(deleteBankId);
      if (!response.success) {
        toast.error(response.message || "Failed to delete bank");
        return;
      }

      toast.success("Bank deleted successfully");
      await fetchBanks();
    } catch (error) {
      const err = error as { message?: string };
      toast.error(err.message || "Failed to delete bank");
    } finally {
      setDeleteBankId(null);
      setIsDeleting(false);
    }
  };

  const goToPage = (nextPage: number) => {
    setPage(Math.min(Math.max(nextPage, 1), totalPages));
  };

  return (
    <>
      <AlertDialog
        open={!!deleteBankId}
        onOpenChange={() => {
          if (!isDeleting) {
            setDeleteBankId(null);
          }
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete bank?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. The bank will be permanently deleted.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={isDeleting}
              className="bg-red-600 hover:bg-red-700"
            >
              {isDeleting ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <Card>
        <CardHeader className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <CardTitle className="text-xl font-semibold">Banks</CardTitle>
            <CardDescription>
              Manage supported banks and transfer validation rules.
            </CardDescription>
          </div>
          <Button asChild>
            <Link href="/admin/banks/create">Create Bank</Link>
          </Button>
        </CardHeader>

        <CardContent className="space-y-4">
          <div className="grid gap-3 md:grid-cols-4">
            <div className="relative md:col-span-3">
              <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search by bank name or code"
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setPage(1);
                }}
                className="pl-9"
              />
            </div>

            <Select
              value={statusFilter}
              onValueChange={(value) => {
                setStatusFilter(value as StatusFilter);
                setPage(1);
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All statuses</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Button
              variant="outline"
              onClick={() => {
                setSearch("");
                setStatusFilter("all");
                setPage(1);
              }}
            >
              Reset filters
            </Button>
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>#</TableHead>
                <TableHead>Bank</TableHead>
                <TableHead>Code</TableHead>
                <TableHead>Min Transfer</TableHead>
                <TableHead>Max Transfer</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Updated</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={8} className="py-8 text-center">
                    Loading banks...
                  </TableCell>
                </TableRow>
              ) : paginatedBanks.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="py-8 text-center">
                    No banks found.
                  </TableCell>
                </TableRow>
              ) : (
                paginatedBanks.map((bank, index) => (
                  <TableRow key={bank._id}>
                    <TableCell className="text-muted-foreground">
                      {(page - 1) * limit + index + 1}
                    </TableCell>
                    <TableCell className="font-medium">{bank.name}</TableCell>
                    <TableCell>{bank.code}</TableCell>
                    <TableCell>{formatAmount(bank.minTransfer)}</TableCell>
                    <TableCell>{formatAmount(bank.maxTransfer)}</TableCell>
                    <TableCell>
                      <Badge variant={bank.isActive ? "default" : "secondary"}>
                        {bank.isActive ? "Active" : "Inactive"}
                      </Badge>
                    </TableCell>
                    <TableCell>{formatDateTime(bank.updatedAt)}</TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreVertical className="size-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem asChild>
                            <Link
                              href={`/admin/banks/${bank._id}`}
                              className="flex items-center gap-2"
                            >
                              <Eye className="size-4" />
                              View
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem asChild>
                            <Link
                              href={`/admin/banks/${bank._id}/edit`}
                              className="flex items-center gap-2"
                            >
                              <Pencil className="size-4" />
                              Edit
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            className="text-destructive"
                            onSelect={(e) => {
                              e.preventDefault();
                              setDeleteBankId(bank._id);
                            }}
                          >
                            <Trash2 className="size-4" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>

          <div className="mt-4 flex items-center justify-between">
            <p className="text-sm text-muted-foreground">Total banks: {total}</p>
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    onClick={() => goToPage(page - 1)}
                    className={page === 1 ? "pointer-events-none opacity-50" : ""}
                  />
                </PaginationItem>

                {Array.from({ length: Math.min(5, totalPages) }).map((_, i) => {
                  const half = Math.floor(5 / 2);
                  let start = Math.max(1, page - half);
                  if (start + 4 > totalPages) {
                    start = Math.max(1, totalPages - 4);
                  }
                  const pageNumber = start + i;
                  if (pageNumber > totalPages) return null;

                  return (
                    <PaginationItem key={pageNumber}>
                      <PaginationLink
                        isActive={pageNumber === page}
                        onClick={() => goToPage(pageNumber)}
                      >
                        {pageNumber}
                      </PaginationLink>
                    </PaginationItem>
                  );
                })}

                <PaginationItem>
                  <PaginationNext
                    onClick={() => goToPage(page + 1)}
                    className={
                      page === totalPages ? "pointer-events-none opacity-50" : ""
                    }
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        </CardContent>
      </Card>
    </>
  );
}

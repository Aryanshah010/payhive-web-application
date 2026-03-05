"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { getAllFeeConfigs } from "@/lib/api/admin/fee-config";
import { handleDeleteOneFeeConfig } from "@/lib/actions/admin/fee-config-action";
import type { AdminFeeConfig, FeeAppliesTo } from "@/lib/types/admin-fee-config";
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
import { MoreVertical, Eye, Pencil, Trash2 } from "lucide-react";
import { toast } from "react-toastify";
import {
  APPLIES_TO_OPTIONS,
  formatAppliesTo,
} from "./fee-config-utils";

type StatusFilter = "all" | "active" | "inactive";

type AppliesToFilter = "all" | FeeAppliesTo;

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

export default function FeeConfigsTable() {
  const [configs, setConfigs] = useState<AdminFeeConfig[]>([]);
  const [loading, setLoading] = useState(true);

  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [appliesToFilter, setAppliesToFilter] =
    useState<AppliesToFilter>("all");

  const [deleteConfigId, setDeleteConfigId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchConfigs = async () => {
    setLoading(true);

    try {
      const response = await getAllFeeConfigs({
        page,
        limit,
        isActive:
          statusFilter === "all" ? undefined : statusFilter === "active",
        appliesTo: appliesToFilter === "all" ? undefined : appliesToFilter,
      });

      if (response?.success) {
        setConfigs(response.data.items || []);
        setTotal(response.data.total || 0);
        setTotalPages(response.data.totalPages || 1);
      } else {
        setConfigs([]);
      }
    } catch (error) {
      const err = error as { message?: string };
      toast.error(err.message || "Failed to fetch fee configs");
      setConfigs([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteConfigId) return;

    setIsDeleting(true);
    try {
      const response = await handleDeleteOneFeeConfig(deleteConfigId);
      if (!response.success) {
        toast.error(response.message || "Failed to delete fee config");
        return;
      }

      toast.success("Fee config deleted successfully");
      await fetchConfigs();
    } catch (error) {
      const err = error as { message?: string };
      toast.error(err.message || "Failed to delete fee config");
    } finally {
      setDeleteConfigId(null);
      setIsDeleting(false);
    }
  };

  useEffect(() => {
    fetchConfigs();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, limit, statusFilter, appliesToFilter]);

  useEffect(() => {
    if (page > totalPages) {
      setPage(totalPages);
    }
  }, [page, totalPages]);

  const goToPage = (nextPage: number) => {
    setPage(Math.min(Math.max(nextPage, 1), totalPages));
  };

  return (
    <>
      <AlertDialog
        open={!!deleteConfigId}
        onOpenChange={() => {
          if (!isDeleting) {
            setDeleteConfigId(null);
          }
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete fee config?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. The fee config will be permanently
              deleted.
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
            <CardTitle className="text-xl font-semibold">Monetization</CardTitle>
            <CardDescription>
              Manage service payment fee configurations.
            </CardDescription>
          </div>
          <Button asChild>
            <Link href="/admin/monetization/create">Create Fee Config</Link>
          </Button>
        </CardHeader>

        <CardContent className="space-y-4">
          <div className="grid gap-3 md:grid-cols-3">
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

            <Select
              value={appliesToFilter}
              onValueChange={(value) => {
                setAppliesToFilter(value as AppliesToFilter);
                setPage(1);
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="Applies to" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All services</SelectItem>
                {APPLIES_TO_OPTIONS.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Button
              variant="outline"
              onClick={() => {
                setStatusFilter("all");
                setAppliesToFilter("all");
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
                <TableHead>Description</TableHead>
                <TableHead>Applies To</TableHead>
                <TableHead>Fee</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Updated</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={7} className="py-8 text-center">
                    Loading fee configs...
                  </TableCell>
                </TableRow>
              ) : configs.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="py-8 text-center">
                    No fee configs found.
                  </TableCell>
                </TableRow>
              ) : (
                configs.map((config, index) => (
                  <TableRow key={config._id}>
                    <TableCell className="text-muted-foreground">
                      {(page - 1) * limit + index + 1}
                    </TableCell>
                    <TableCell className="font-medium">
                      {config.description}
                    </TableCell>
                    <TableCell>{formatAppliesTo(config.appliesTo)}</TableCell>
                    <TableCell>
                      {formatAmount(config.calculation.fixedAmount)}
                    </TableCell>
                    <TableCell>
                      <Badge variant={config.isActive ? "default" : "secondary"}>
                        {config.isActive ? "Active" : "Inactive"}
                      </Badge>
                    </TableCell>
                    <TableCell>{formatDateTime(config.updatedAt)}</TableCell>
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
                              href={`/admin/monetization/${config._id}`}
                              className="flex items-center gap-2"
                            >
                              <Eye className="size-4" />
                              View
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem asChild>
                            <Link
                              href={`/admin/monetization/${config._id}/edit`}
                              className="flex items-center gap-2"
                            >
                              <Pencil className="size-4" />
                              Edit
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            className="text-destructive"
                            onSelect={(event) => {
                              event.preventDefault();
                              setDeleteConfigId(config._id);
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
            <p className="text-sm text-muted-foreground">
              Total configs: {total}
            </p>
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    onClick={() => goToPage(page - 1)}
                    className={
                      page === 1 ? "pointer-events-none opacity-50" : ""
                    }
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
                      page === totalPages
                        ? "pointer-events-none opacity-50"
                        : ""
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

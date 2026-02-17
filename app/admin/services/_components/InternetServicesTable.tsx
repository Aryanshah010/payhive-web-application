"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { getAllInternetServices } from "@/lib/api/admin/service";
import { handleDeleteOneInternetService } from "@/lib/actions/admin/service-action";
import type { AdminUtilityService } from "@/lib/types/admin-services";
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
import { Search, MoreVertical, Eye, Pencil, Trash2 } from "lucide-react";
import { toast } from "react-toastify";

const formatDateTime = (value?: string | Date | null) => {
  if (!value) return "—";

  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) return "—";

  return new Intl.DateTimeFormat("en-US", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
};

type ActiveFilter = "all" | "active" | "inactive";

export default function InternetServicesTable() {
  const [services, setServices] = useState<AdminUtilityService[]>([]);
  const [loading, setLoading] = useState(true);

  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [providerFilter, setProviderFilter] = useState("");
  const [activeFilter, setActiveFilter] = useState<ActiveFilter>("all");

  const [deleteServiceId, setDeleteServiceId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchServices = async () => {
    setLoading(true);

    try {
      const response = await getAllInternetServices({
        page,
        limit,
        search: debouncedSearch,
        provider: providerFilter,
        isActive:
          activeFilter === "all"
            ? undefined
            : activeFilter === "active",
      });

      if (response?.success) {
        setServices(response.data.items || []);
        setTotal(response.data.total || 0);
        setTotalPages(response.data.totalPages || 1);
      } else {
        setServices([]);
      }
    } catch (error) {
      const err = error as { message?: string };
      toast.error(err.message || "Failed to fetch internet services");
      setServices([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteServiceId) return;

    setIsDeleting(true);
    try {
      const response = await handleDeleteOneInternetService(deleteServiceId);
      if (!response.success) {
        toast.error(response.message || "Failed to delete internet service");
        return;
      }

      toast.success("Internet service deleted successfully");
      await fetchServices();
    } catch (error) {
      const err = error as { message?: string };
      toast.error(err.message || "Failed to delete internet service");
    } finally {
      setIsDeleting(false);
      setDeleteServiceId(null);
    }
  };

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1);
    }, 300);

    return () => clearTimeout(handler);
  }, [search]);

  useEffect(() => {
    fetchServices();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, limit, debouncedSearch, providerFilter, activeFilter]);

  const goToPage = (nextPage: number) => {
    setPage(Math.min(Math.max(nextPage, 1), totalPages));
  };

  return (
    <>
      <AlertDialog
        open={!!deleteServiceId}
        onOpenChange={() => setDeleteServiceId(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete internet service?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. The selected internet service will
              be removed permanently.
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
        <CardHeader>
          <CardTitle className="text-xl font-semibold">Internet</CardTitle>
          <CardDescription>
            Manage internet service plans and pricing.
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          <div className="grid gap-3 md:grid-cols-4">
            <div className="relative md:col-span-2">
              <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search by provider, name, or package"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9"
              />
            </div>

            <Input
              placeholder="Provider"
              value={providerFilter}
              onChange={(e) => {
                setProviderFilter(e.target.value);
                setPage(1);
              }}
            />

            <Select
              value={activeFilter}
              onValueChange={(value) => {
                setActiveFilter(value as ActiveFilter);
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
                setDebouncedSearch("");
                setProviderFilter("");
                setActiveFilter("all");
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
                <TableHead>Provider</TableHead>
                <TableHead>Service</TableHead>
                <TableHead>Package</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Updated</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={8} className="py-8 text-center">
                    Loading internet services...
                  </TableCell>
                </TableRow>
              ) : services.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="py-8 text-center">
                    No internet services found.
                  </TableCell>
                </TableRow>
              ) : (
                services.map((service, index) => (
                  <TableRow key={service._id}>
                    <TableCell className="text-muted-foreground">
                      {(page - 1) * limit + index + 1}
                    </TableCell>
                    <TableCell className="font-medium">
                      {service.provider}
                    </TableCell>
                    <TableCell>{service.name}</TableCell>
                    <TableCell>{service.packageLabel || "—"}</TableCell>
                    <TableCell>
                      {new Intl.NumberFormat("en-NP", {
                        style: "currency",
                        currency: "NPR",
                        maximumFractionDigits: 0,
                      }).format(service.amount)}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={service.isActive ? "default" : "secondary"}
                      >
                        {service.isActive ? "Active" : "Inactive"}
                      </Badge>
                    </TableCell>
                    <TableCell>{formatDateTime(service.updatedAt)}</TableCell>
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
                              href={`/admin/services/internet/${service._id}`}
                              className="flex items-center gap-2"
                            >
                              <Eye className="size-4" />
                              View
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem asChild>
                            <Link
                              href={`/admin/services/internet/${service._id}/edit`}
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
                              setDeleteServiceId(service._id);
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
              Total internet services: {total}
            </p>
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

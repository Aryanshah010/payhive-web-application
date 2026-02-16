"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { getAllHotels } from "@/lib/api/admin/service";
import { handleDeleteOneHotel } from "@/lib/actions/admin/service-action";
import type { AdminHotel } from "@/lib/types/admin-services";
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
import { Search, MoreVertical, Eye, Pencil, Trash2 } from "lucide-react";
import { toast } from "react-toastify";

export default function HotelsTable() {
  const [hotels, setHotels] = useState<AdminHotel[]>([]);
  const [loading, setLoading] = useState(true);

  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [cityFilter, setCityFilter] = useState("");

  const [deleteHotelId, setDeleteHotelId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchHotels = async () => {
    setLoading(true);

    try {
      const response = await getAllHotels({
        page,
        limit,
        search: debouncedSearch,
        city: cityFilter,
      });

      if (response?.success) {
        setHotels(response.data.items || []);
        setTotal(response.data.total || 0);
        setTotalPages(response.data.totalPages || 1);
      } else {
        setHotels([]);
      }
    } catch (error) {
      const err = error as { message?: string };
      toast.error(err.message || "Failed to fetch hotels");
      setHotels([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteHotelId) return;

    setIsDeleting(true);
    try {
      const response = await handleDeleteOneHotel(deleteHotelId);
      if (!response.success) {
        toast.error(response.message || "Failed to delete hotel");
        return;
      }

      toast.success("Hotel deleted successfully");
      await fetchHotels();
    } catch (error) {
      const err = error as { message?: string };
      toast.error(err.message || "Failed to delete hotel");
    } finally {
      setIsDeleting(false);
      setDeleteHotelId(null);
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
    fetchHotels();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, limit, debouncedSearch, cityFilter]);

  const goToPage = (nextPage: number) => {
    setPage(Math.min(Math.max(nextPage, 1), totalPages));
  };

  return (
    <>
      <AlertDialog
        open={!!deleteHotelId}
        onOpenChange={() => setDeleteHotelId(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete hotel?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. The selected hotel will be removed
              permanently.
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
          <CardTitle className="text-xl font-semibold">Hotels</CardTitle>
          <CardDescription>Manage hotel inventory and room pricing</CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          <div className="grid gap-3 md:grid-cols-3">
            <div className="relative md:col-span-2">
              <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search by name, city, or room type"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9"
              />
            </div>

            <Input
              placeholder="City"
              value={cityFilter}
              onChange={(e) => {
                setCityFilter(e.target.value);
                setPage(1);
              }}
            />
          </div>

          <div>
            <Button
              variant="outline"
              onClick={() => {
                setSearch("");
                setDebouncedSearch("");
                setCityFilter("");
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
                <TableHead>Name</TableHead>
                <TableHead>City</TableHead>
                <TableHead>Room Type</TableHead>
                <TableHead>Price/Night</TableHead>
                <TableHead>Rooms</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={7} className="py-8 text-center">
                    Loading hotels...
                  </TableCell>
                </TableRow>
              ) : hotels.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="py-8 text-center">
                    No hotels found.
                  </TableCell>
                </TableRow>
              ) : (
                hotels.map((hotel, index) => (
                  <TableRow key={hotel._id}>
                    <TableCell className="text-muted-foreground">
                      {(page - 1) * limit + index + 1}
                    </TableCell>
                    <TableCell className="font-medium">{hotel.name}</TableCell>
                    <TableCell>{hotel.city}</TableCell>
                    <TableCell>{hotel.roomType}</TableCell>
                    <TableCell>
                      {new Intl.NumberFormat("en-NP", {
                        style: "currency",
                        currency: "NPR",
                        maximumFractionDigits: 0,
                      }).format(hotel.pricePerNight)}
                    </TableCell>
                    <TableCell>
                      {hotel.roomsAvailable}/{hotel.roomsTotal}
                    </TableCell>
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
                              href={`/admin/services/hotels/${hotel._id}`}
                              className="flex items-center gap-2"
                            >
                              <Eye className="size-4" />
                              View
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem asChild>
                            <Link
                              href={`/admin/services/hotels/${hotel._id}/edit`}
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
                              setDeleteHotelId(hotel._id);
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
            <p className="text-sm text-muted-foreground">Total hotels: {total}</p>
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

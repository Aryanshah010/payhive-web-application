"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import { getAllUsers } from "@/lib/api/admin/user";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
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
import Link from "next/link";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  EyeIcon,
  EditIcon,
  DeleteIcon,
  MoreVerticalIcon,
} from "@hugeicons/core-free-icons";
import UserAvatar from "./_components/UserAvatar";
import { Separator } from "@/components/ui/separator";
import { Search } from "lucide-react";
import { toast } from "react-toastify";
import { handleDeleteOneUser } from "@/lib/actions/admin/user-action";

export default function UsersTable() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [deleteUserId, setDeleteUserId] = useState<string | null>(null);
  const [isDeleting] = useState(false);

  const handleDelete = async () => {
    if (!deleteUserId) return;

    try {
      await handleDeleteOneUser(deleteUserId);
      toast.success("User deleted successfully");

      await fetchUsers();
    } catch (err: any) {
      toast.error(err.message || "Failed to delete user");
    } finally {
      setDeleteUserId(null);
    }
  };

  const fetchUsers = async () => {
    setLoading(true);

    const res = await getAllUsers(page, limit, debouncedSearch, role);

    if (res.success && res.data) {
      setUsers(res.data.users);
      setTotal(res.data.total);
      setTotalPages(res.data.totalPages);
    } else {
      setUsers([]);
    }

    setLoading(false);
  };

  const [role, setRole] = useState("");

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1);
    }, 300);

    return () => clearTimeout(handler);
  }, [search]);

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);

      const res = await getAllUsers(page, limit, debouncedSearch, role);

      if (res.success && res.data) {
        setUsers(res.data.users);
        setTotal(res.data.total);
        setTotalPages(res.data.totalPages);
      } else {
        setUsers([]);
      }

      setLoading(false);
    };

    fetchUsers();
  }, [page, limit, debouncedSearch, role]);

  const goToPage = (p: number) => {
    const clamped = Math.min(Math.max(1, p), totalPages);
    setPage(clamped);
  };

  const handleSearchChange = (value: string) => {
    setSearch(value);
  };

  const handleRoleChange = (value: string) => {
    setPage(1);
    setRole(value === "all" ? "" : value);
  };

  return (
    <div className="p-6">
      <AlertDialog
        open={!!deleteUserId}
        onOpenChange={() => setDeleteUserId(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete user?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the
              user and remove their data from the system.
            </AlertDialogDescription>
          </AlertDialogHeader>

          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              disabled={isDeleting}
              onClick={handleDelete}
              className="bg-red-600 hover:bg-red-700"
            >
              {isDeleting ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <Card>
        <CardHeader>
          <CardTitle className="text-xl font-semibold">Users Table</CardTitle>
          <CardDescription>Manage all registered users</CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
            <div className="relative w-full sm:max-w-xs">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

              <Input
                placeholder="Search by name or phone number"
                value={search}
                onChange={(e) => handleSearchChange(e.target.value)}
                className="h-10 rounded-lg pl-9 pr-9 bg-muted/40 focus:bg-background transition"
              />

              {search && (
                <button
                  onClick={() => handleSearchChange("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition"
                  aria-label="Clear search"
                >
                  ✕
                </button>
              )}
            </div>

            <Select value={role || "all"} onValueChange={handleRoleChange}>
              <SelectTrigger className="sm:w-45">
                <SelectValue placeholder="Filter by role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All roles</SelectItem>
                <SelectItem value="admin">Admin</SelectItem>
                <SelectItem value="user">User</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-15">#</TableHead>
                <TableHead>User</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Role</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8">
                    Loading users...
                  </TableCell>
                </TableRow>
              ) : users.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8">
                    No users found.
                  </TableCell>
                </TableRow>
              ) : (
                users.map((user, index) => (
                  <TableRow key={user._id}>
                    <TableCell className="text-muted-foreground">
                      {(page - 1) * limit + index + 1}
                    </TableCell>

                    <TableCell>
                      <div className="flex items-center gap-3">
                        <UserAvatar
                          imageUrl={user.imageUrl}
                          fullName={user.fullName}
                          size={36}
                        />
                        <span className="font-medium">{user.fullName}</span>
                      </div>
                    </TableCell>

                    <TableCell>{user.phoneNumber}</TableCell>
                    <TableCell>{user.email}</TableCell>

                    <TableCell>
                      <RoleBadge role={user.role} />
                    </TableCell>

                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <HugeiconsIcon icon={MoreVerticalIcon} size={18} />
                          </Button>
                        </DropdownMenuTrigger>

                        <DropdownMenuContent align="end">
                          <DropdownMenuItem asChild>
                            <Link
                              href={`/admin/users/${user._id}`}
                              className="flex items-center gap-2"
                            >
                              <HugeiconsIcon icon={EyeIcon} size={16} />
                              View
                            </Link>
                          </DropdownMenuItem>

                          <DropdownMenuItem asChild>
                            <Link
                              href={`/admin/users/${user._id}/edit`}
                              className="flex items-center gap-2"
                            >
                              <HugeiconsIcon icon={EditIcon} size={16} />
                              Edit
                            </Link>
                          </DropdownMenuItem>

                          <Separator />

                          <DropdownMenuItem
                            disabled={user.role === "admin"}
                            onSelect={(e) => {
                              if (user.role === "admin") {
                                e.preventDefault();
                                toast.error("Admins cannot be deleted");
                                return;
                              }

                              e.preventDefault();
                              setDeleteUserId(user._id);
                            }}
                            className="flex items-center gap-2 text-destructive disabled:opacity-50"
                          >
                            <HugeiconsIcon icon={DeleteIcon} size={16} />
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

          <div className="flex items-center justify-between mt-4">
            <p className="text-sm">Total Users: {total}</p>

            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    onClick={() => {
                      if (page === 1) return;
                      goToPage(page - 1);
                    }}
                    className={
                      page === 1 ? "pointer-events-none opacity-50" : ""
                    }
                  />
                </PaginationItem>

                {Array.from({ length: Math.min(5, totalPages) }).map((_, i) => {
                  const half = Math.floor(5 / 2);
                  let start = Math.max(1, page - half);
                  if (start + 4 > totalPages)
                    start = Math.max(1, totalPages - 4);
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
                    onClick={() => {
                      if (page === totalPages) return;
                      goToPage(page + 1);
                    }}
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
    </div>
  );
}

function RoleBadge({ role }: { role: string }) {
  return role === "admin" ? (
    <Badge className="bg-red-500/10 text-red-600">Admin</Badge>
  ) : (
    <Badge className="bg-green-500/10 text-green-600">User</Badge>
  );
}

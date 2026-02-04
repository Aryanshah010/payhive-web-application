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

export default function UsersTable() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      const usersResult = await getAllUsers();

      if (usersResult.success) {
        setUsers(usersResult.data);
      }

      setLoading(false);
    };

    fetchUsers();
  }, []);

  return (
    <div className="p-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-xl font-semibold">Users Table</CardTitle>
          <CardDescription>Manage all registered users</CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* 🔍 Search + Filter (UI only) */}
          <div className="flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
            <Input
              placeholder="Search by name or phone..."
              className="sm:max-w-xs"
              disabled
            />

            <Select disabled>
              <SelectTrigger className="sm:w-45">
                <SelectValue placeholder="Filter by role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All roles</SelectItem>
                <SelectItem value="admin">Admin</SelectItem>
                <SelectItem value="user">User</SelectItem>
                <SelectItem value="manager">Manager</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* 📋 Table */}
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-15">#</TableHead>
                <TableHead>User</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead>Role</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell
                    colSpan={5}
                    className="text-center text-muted-foreground py-8"
                  >
                    Loading users...
                  </TableCell>
                </TableRow>
              ) : (
                users.map((user, index) => (
                  <TableRow
                    key={user._id}
                    className="hover:bg-muted/50 transition-colors"
                  >
                    <TableCell className="text-muted-foreground">
                      {index + 1}
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

                          <DropdownMenuItem className="text-destructive">
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

          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious />
              </PaginationItem>

              <PaginationItem>
                <PaginationLink isActive>1</PaginationLink>
              </PaginationItem>
              <PaginationItem>
                <PaginationLink>2</PaginationLink>
              </PaginationItem>
              <PaginationItem>
                <PaginationLink>3</PaginationLink>
              </PaginationItem>

              <PaginationItem>
                <PaginationNext />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </CardContent>
      </Card>
    </div>
  );
}

function RoleBadge({ role }: { role: string }) {
  if (role === "admin") {
    return <Badge className="bg-red-500/10 text-red-600">Admin</Badge>;
  } else {
    return <Badge className="bg-green-500/10 text-green-600">User</Badge>;
  }
}

/* eslint-disable @typescript-eslint/no-explicit-any */

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
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { HugeiconsIcon } from "@hugeicons/react";
import { EyeIcon, DeleteIcon, EditIcon } from "@hugeicons/core-free-icons";
import UserAvatar from "./_components/UserAvatar";

export default async function UsersPage() {
  const usersResult = await getAllUsers();

  if (!usersResult.success) {
    throw new Error("Error fetching users data");
  }

  const users = usersResult.data;

  return (
    <div className="p-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-xl font-bold">Users</CardTitle>
          <CardDescription>Manage all registered users</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>S.No</TableHead>
                <TableHead>Profile</TableHead>
                <TableHead>Full Name</TableHead>
                <TableHead>Phone Number</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((user: any, index: number) => (
                <TableRow key={user._id}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell className="align-middle">
                    <UserAvatar
                      imageUrl={user.imageUrl}
                      fullName={user.fullName}
                      size={40}
                    />
                  </TableCell>

                  <TableCell>{user.fullName}</TableCell>
                  <TableCell>{user.phoneNumber}</TableCell>
                  <TableCell>{user.role}</TableCell>
                  <TableCell className="space-x-2">
                    <Link href={`/admin/users/${user._id}`}>
                      <Button variant="outline" size="sm">
                        <HugeiconsIcon icon={EyeIcon} size={18} />
                      </Button>
                    </Link>

                    <Link href={`/admin/users/${user._id}/edit`}>
                      <Button variant="secondary" size="sm">
                        <HugeiconsIcon icon={EditIcon} size={18} />
                      </Button>
                    </Link>

                    <Button variant="destructive" size="sm">
                      <HugeiconsIcon icon={DeleteIcon} size={18} />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}

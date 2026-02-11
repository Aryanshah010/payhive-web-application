import Link from "next/link";
import { notFound } from "next/navigation";
import { handleGetOneUser } from "@/lib/actions/admin/user-action";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import UserAvatar from "../_components/UserAvatar";

function formatDate(value?: string | Date | null) {
  if (!value) return "—";
  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) return "—";
  return new Intl.DateTimeFormat("en-US", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
}

function RoleBadge({ role }: { role: string }) {
  return role === "admin" ? (
    <Badge className="bg-red-500/10 text-red-600">Admin</Badge>
  ) : (
    <Badge className="bg-green-500/10 text-green-600">User</Badge>
  );
}

function DetailRow({ label, value }: { label: string; value?: string }) {
  return (
    <div className="flex items-center justify-between gap-4">
      <span className="text-sm text-muted-foreground">{label}</span>
      <span className="text-sm font-medium text-right break-all">{value || "—"}</span>
    </div>
  );
}

export default async function Page({
  params,
}: {
  params: { id: string };
}) {
  const { id } = await params;
  const result = await handleGetOneUser(id);

  if (!result.success || !result.data) {
    notFound();
  }

  const user = result.data;

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h1 className="text-2xl font-semibold">User Details</h1>
          <p className="text-sm text-muted-foreground">
            View profile and account metadata
          </p>
        </div>
        <Button asChild variant="ghost">
          <Link href="/admin/users">Back to users</Link>
        </Button>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.2fr_1fr]">
        <Card>
          <CardHeader className="space-y-4">
            <div className="flex items-center gap-4">
              <UserAvatar
                imageUrl={user.imageUrl}
                fullName={user.fullName}
                size={72}
              />
              <div>
                <CardTitle className="text-xl">{user.fullName}</CardTitle>
                <div className="mt-2">
                  <RoleBadge role={user.role} />
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <h3 className="text-sm font-semibold text-foreground">Contact</h3>
              <DetailRow label="Full Name" value={user.fullName} />
              <DetailRow label="Phone" value={user.phoneNumber} />
              <DetailRow label="Email" value={user.email} />
            </div>
            <Separator />
            <div className="space-y-3">
              <h3 className="text-sm font-semibold text-foreground">Account</h3>
              <DetailRow label="Role" value={user.role} />
              <DetailRow label="User ID" value={user._id} />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Metadata</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <DetailRow label="Created" value={formatDate(user.createdAt)} />
            <DetailRow label="Updated" value={formatDate(user.updatedAt)} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

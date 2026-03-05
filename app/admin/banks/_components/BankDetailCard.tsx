import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import type { AdminBank } from "@/lib/types/admin-bank";

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

function DetailRow({ label, value }: { label: string; value?: string }) {
  return (
    <div className="flex items-center justify-between gap-4">
      <span className="text-sm text-muted-foreground">{label}</span>
      <span className="text-right text-sm font-medium break-all">{value || "—"}</span>
    </div>
  );
}

export default function BankDetailCard({ bank }: { bank: AdminBank }) {
  return (
    <div className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
      <Card>
        <CardHeader className="space-y-2">
          <div className="flex items-center justify-between gap-3">
            <CardTitle className="text-xl">{bank.name}</CardTitle>
            <Badge variant={bank.isActive ? "default" : "secondary"}>
              {bank.isActive ? "Active" : "Inactive"}
            </Badge>
          </div>
          <p className="text-sm text-muted-foreground">Code: {bank.code}</p>
        </CardHeader>

        <CardContent className="space-y-4">
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-foreground">Transfer Rules</h3>
            <DetailRow label="Min Transfer" value={formatAmount(bank.minTransfer)} />
            <DetailRow label="Max Transfer" value={formatAmount(bank.maxTransfer)} />
            <DetailRow
              label="Account Number Regex"
              value={bank.accountNumberRegex || "—"}
            />
          </div>

          <Separator />

          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-foreground">Status</h3>
            <DetailRow label="Active" value={bank.isActive ? "Yes" : "No"} />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Metadata</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <DetailRow label="Bank ID" value={bank._id} />
          <DetailRow label="Created" value={formatDateTime(bank.createdAt)} />
          <DetailRow label="Updated" value={formatDateTime(bank.updatedAt)} />
        </CardContent>
      </Card>
    </div>
  );
}

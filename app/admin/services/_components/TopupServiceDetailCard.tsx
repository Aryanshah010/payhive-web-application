import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import type { AdminUtilityService } from "@/lib/types/admin-services";

const formatDateTime = (value?: string | Date | null) => {
  if (!value) return "—";

  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) return "—";

  return new Intl.DateTimeFormat("en-US", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
};

function DetailRow({ label, value }: { label: string; value?: string }) {
  return (
    <div className="flex items-center justify-between gap-4">
      <span className="text-sm text-muted-foreground">{label}</span>
      <span className="text-right text-sm font-medium break-all">{value || "—"}</span>
    </div>
  );
}

export default function TopupServiceDetailCard({
  service,
}: {
  service: AdminUtilityService;
}) {
  const amount = new Intl.NumberFormat("en-NP", {
    style: "currency",
    currency: "NPR",
    maximumFractionDigits: 0,
  }).format(service.amount);

  return (
    <div className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
      <Card>
        <CardHeader className="space-y-2">
          <div className="flex items-center justify-between gap-3">
            <CardTitle className="text-xl">{service.name}</CardTitle>
            <Badge variant={service.isActive ? "default" : "secondary"}>
              {service.isActive ? "Active" : "Inactive"}
            </Badge>
          </div>
          <p className="text-sm text-muted-foreground">{service.provider}</p>
        </CardHeader>

        <CardContent className="space-y-4">
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-foreground">Service Details</h3>
            <DetailRow label="Package" value={service.packageLabel || "—"} />
            <DetailRow label="Amount" value={amount} />
            <DetailRow
              label="Validation Regex"
              value={service.validationRegex || "—"}
            />
          </div>

          <Separator />

          <div className="space-y-2">
            <h3 className="text-sm font-semibold text-foreground">Meta</h3>
            <pre className="overflow-auto rounded-lg border border-border/70 bg-muted/30 p-3 text-xs text-muted-foreground">
              {service.meta && Object.keys(service.meta).length > 0
                ? JSON.stringify(service.meta, null, 2)
                : "{}"}
            </pre>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Metadata</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <DetailRow label="Service ID" value={service._id} />
          <DetailRow label="Type" value="Topup" />
          <DetailRow label="Created" value={formatDateTime(service.createdAt)} />
          <DetailRow label="Updated" value={formatDateTime(service.updatedAt)} />
        </CardContent>
      </Card>
    </div>
  );
}

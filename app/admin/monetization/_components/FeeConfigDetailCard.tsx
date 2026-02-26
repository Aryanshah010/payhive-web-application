import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import type { AdminFeeConfig } from "@/lib/types/admin-fee-config";
import {
  APPLIES_TO_OPTIONS,
  FEE_TYPE_LABELS,
} from "./fee-config-utils";

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

const resolveAppliesToLabel = (value: string) =>
  APPLIES_TO_OPTIONS.find((option) => option.value === value)?.label || value;

function DetailRow({ label, value }: { label: string; value?: string }) {
  return (
    <div className="flex items-center justify-between gap-4">
      <span className="text-sm text-muted-foreground">{label}</span>
      <span className="text-right text-sm font-medium break-all">
        {value || "—"}
      </span>
    </div>
  );
}

export default function FeeConfigDetailCard({
  config,
}: {
  config: AdminFeeConfig;
}) {
  return (
    <div className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
      <Card>
        <CardHeader className="space-y-2">
          <div className="flex items-center justify-between gap-3">
            <CardTitle className="text-xl">{config.description}</CardTitle>
            <Badge variant={config.isActive ? "default" : "secondary"}>
              {config.isActive ? "Active" : "Inactive"}
            </Badge>
          </div>
          <p className="text-sm text-muted-foreground">
            {FEE_TYPE_LABELS[config.type]}
          </p>
        </CardHeader>

        <CardContent className="space-y-4">
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-foreground">
              Calculation
            </h3>
            <DetailRow label="Mode" value="Fixed" />
            <DetailRow
              label="Fixed Amount"
              value={formatAmount(config.calculation.fixedAmount)}
            />
          </div>

          <Separator />

          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-foreground">Applies To</h3>
            <div className="flex flex-wrap gap-2">
              {config.appliesTo.map((item) => (
                <Badge key={item} variant="secondary">
                  {resolveAppliesToLabel(item)}
                </Badge>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Metadata</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <DetailRow label="Config ID" value={config._id} />
          <DetailRow label="Created" value={formatDateTime(config.createdAt)} />
          <DetailRow label="Updated" value={formatDateTime(config.updatedAt)} />
        </CardContent>
      </Card>
    </div>
  );
}

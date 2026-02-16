import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import type { AdminFlight } from "@/lib/types/admin-services";

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
      <span className="text-right text-sm font-medium">{value || "—"}</span>
    </div>
  );
}

export default function FlightDetailCard({ flight }: { flight: AdminFlight }) {
  const price = new Intl.NumberFormat("en-NP", {
    style: "currency",
    currency: "NPR",
    maximumFractionDigits: 0,
  }).format(flight.price);

  return (
    <div className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
      <Card>
        <CardHeader className="space-y-3">
          <div className="flex items-center justify-between gap-3">
            <CardTitle className="text-xl">{flight.airline}</CardTitle>
            <Badge variant="outline">{flight.class}</Badge>
          </div>
          <p className="text-sm text-muted-foreground">{flight.flightNumber}</p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-foreground">Route</h3>
            <DetailRow label="From" value={flight.from} />
            <DetailRow label="To" value={flight.to} />
            <DetailRow label="Departure" value={formatDateTime(flight.departure)} />
            <DetailRow label="Arrival" value={formatDateTime(flight.arrival)} />
            <DetailRow
              label="Duration"
              value={`${flight.durationMinutes} minutes`}
            />
          </div>

          <Separator />

          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-foreground">Inventory</h3>
            <DetailRow label="Price" value={price} />
            <DetailRow label="Seats Total" value={String(flight.seatsTotal)} />
            <DetailRow
              label="Seats Available"
              value={String(flight.seatsAvailable)}
            />
          </div>

          <Separator />

          <div className="space-y-2">
            <h3 className="text-sm font-semibold text-foreground">Meta</h3>
            <pre className="overflow-auto rounded-lg border border-border/70 bg-muted/30 p-3 text-xs text-muted-foreground">
              {flight.meta && Object.keys(flight.meta).length > 0
                ? JSON.stringify(flight.meta, null, 2)
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
          <DetailRow label="Flight ID" value={flight._id} />
          <DetailRow label="Created" value={formatDateTime(flight.createdAt)} />
          <DetailRow label="Updated" value={formatDateTime(flight.updatedAt)} />
        </CardContent>
      </Card>
    </div>
  );
}

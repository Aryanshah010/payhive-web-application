import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import type { AdminHotel } from "@/lib/types/admin-services";

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

export default function HotelDetailCard({ hotel }: { hotel: AdminHotel }) {
  const price = new Intl.NumberFormat("en-NP", {
    style: "currency",
    currency: "NPR",
    maximumFractionDigits: 0,
  }).format(hotel.pricePerNight);

  return (
    <div className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
      <Card>
        <CardHeader className="space-y-1">
          <CardTitle className="text-xl">{hotel.name}</CardTitle>
          <p className="text-sm text-muted-foreground">{hotel.city}</p>
        </CardHeader>

        <CardContent className="space-y-4">
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-foreground">Room Details</h3>
            <DetailRow label="Room Type" value={hotel.roomType} />
            <DetailRow label="Price Per Night" value={price} />
            <DetailRow label="Rooms Total" value={String(hotel.roomsTotal)} />
            <DetailRow
              label="Rooms Available"
              value={String(hotel.roomsAvailable)}
            />
          </div>

          <Separator />

          <div className="space-y-2">
            <h3 className="text-sm font-semibold text-foreground">Amenities</h3>
            <div className="flex flex-wrap gap-2">
              {hotel.amenities && hotel.amenities.length > 0 ? (
                hotel.amenities.map((amenity) => (
                  <Badge key={amenity} variant="outline">
                    {amenity}
                  </Badge>
                ))
              ) : (
                <p className="text-sm text-muted-foreground">No amenities listed</p>
              )}
            </div>
          </div>

          <Separator />

          <div className="space-y-2">
            <h3 className="text-sm font-semibold text-foreground">Images</h3>
            <div className="space-y-1">
              {hotel.images && hotel.images.length > 0 ? (
                hotel.images.map((url) => (
                  <p key={url} className="truncate text-sm text-muted-foreground">
                    {url}
                  </p>
                ))
              ) : (
                <p className="text-sm text-muted-foreground">No image URLs listed</p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Metadata</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <DetailRow label="Hotel ID" value={hotel._id} />
          <DetailRow label="Created" value={formatDateTime(hotel.createdAt)} />
          <DetailRow label="Updated" value={formatDateTime(hotel.updatedAt)} />
        </CardContent>
      </Card>
    </div>
  );
}

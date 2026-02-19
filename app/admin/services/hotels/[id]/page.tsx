import Link from "next/link";
import { notFound } from "next/navigation";
import { Button } from "@/components/ui/button";
import HotelDetailCard from "../../_components/HotelDetailCard";
import { handleGetOneHotel } from "@/lib/actions/admin/service-action";

export default async function Page({
  params,
}: {
  params: { id: string };
}) {
  const { id } = await params;
  const response = await handleGetOneHotel(id);

  if (!response.success || !response.data) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-2">
        <div>
          <h1 className="text-2xl font-semibold">Hotel Details</h1>
          <p className="text-sm text-muted-foreground">
            View hotel inventory, pricing, and room metadata.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button asChild variant="outline">
            <Link href={`/admin/services/hotels/${id}/edit`}>Edit Hotel</Link>
          </Button>
          <Button asChild variant="ghost">
            <Link href="/admin/services?tab=hotels">Back to services</Link>
          </Button>
        </div>
      </div>

      <HotelDetailCard hotel={response.data} />
    </div>
  );
}

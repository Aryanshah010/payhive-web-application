import Link from "next/link";
import { notFound } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import EditHotelForm from "../../../_components/EditHotelForm";
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
    <div className="space-y-4">
      <Button asChild variant="ghost">
        <Link href={`/admin/services/hotels/${id}`}>Back to hotel details</Link>
      </Button>

      <Card className="mx-auto w-full max-w-3xl border-border/70">
        <CardHeader>
          <CardTitle>Update Hotel</CardTitle>
          <p className="text-sm text-muted-foreground">
            Update hotel room inventory, pricing, and listing details.
          </p>
        </CardHeader>

        <CardContent>
          <EditHotelForm hotel={response.data} hotelId={id} />
        </CardContent>
      </Card>
    </div>
  );
}

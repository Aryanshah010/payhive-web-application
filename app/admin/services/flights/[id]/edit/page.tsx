import Link from "next/link";
import { notFound } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import EditFlightForm from "../../../_components/EditFlightForm";
import { handleGetOneFlight } from "@/lib/actions/admin/service-action";

export default async function Page({
  params,
}: {
  params: { id: string };
}) {
  const { id } = await params;
  const response = await handleGetOneFlight(id);

  if (!response.success || !response.data) {
    notFound();
  }

  return (
    <div className="space-y-4">
      <Button asChild variant="ghost">
        <Link href={`/admin/services/flights/${id}`}>Back to flight details</Link>
      </Button>

      <Card className="mx-auto w-full max-w-3xl border-border/70">
        <CardHeader>
          <CardTitle>Update Flight</CardTitle>
          <p className="text-sm text-muted-foreground">
            Update flight schedule, class, fare, and seat inventory.
          </p>
        </CardHeader>

        <CardContent>
          <EditFlightForm flight={response.data} flightId={id} />
        </CardContent>
      </Card>
    </div>
  );
}

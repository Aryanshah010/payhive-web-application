import Link from "next/link";
import { notFound } from "next/navigation";
import { Button } from "@/components/ui/button";
import FlightDetailCard from "../../_components/FlightDetailCard";
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
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-2">
        <div>
          <h1 className="text-2xl font-semibold">Flight Details</h1>
          <p className="text-sm text-muted-foreground">
            View flight information and inventory metadata.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button asChild variant="outline">
            <Link href={`/admin/services/flights/${id}/edit`}>Edit Flight</Link>
          </Button>
          <Button asChild variant="ghost">
            <Link href="/admin/services?tab=flights">Back to services</Link>
          </Button>
        </div>
      </div>

      <FlightDetailCard flight={response.data} />
    </div>
  );
}

import Link from "next/link";
import { notFound } from "next/navigation";
import { Button } from "@/components/ui/button";
import TopupServiceDetailCard from "../../_components/TopupServiceDetailCard";
import { handleGetOneTopupService } from "@/lib/actions/admin/service-action";

export default async function Page({
  params,
}: {
  params: { id: string };
}) {
  const { id } = await params;
  const response = await handleGetOneTopupService(id);

  if (!response.success || !response.data) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-2">
        <div>
          <h1 className="text-2xl font-semibold">Mobile Data/Topup Details</h1>
          <p className="text-sm text-muted-foreground">
            View mobile data/topup configuration, pricing, and metadata.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button asChild variant="outline">
            <Link href={`/admin/services/topup/${id}/edit`}>
              Edit Mobile Data/Topup
            </Link>
          </Button>
          <Button asChild variant="ghost">
            <Link href="/admin/services?tab=topup">Back to services</Link>
          </Button>
        </div>
      </div>

      <TopupServiceDetailCard service={response.data} />
    </div>
  );
}

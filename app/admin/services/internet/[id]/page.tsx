import Link from "next/link";
import { notFound } from "next/navigation";
import { Button } from "@/components/ui/button";
import InternetServiceDetailCard from "../../_components/InternetServiceDetailCard";
import { handleGetOneInternetService } from "@/lib/actions/admin/service-action";

export default async function Page({
  params,
}: {
  params: { id: string };
}) {
  const { id } = await params;
  const response = await handleGetOneInternetService(id);

  if (!response.success || !response.data) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-2">
        <div>
          <h1 className="text-2xl font-semibold">Internet Service Details</h1>
          <p className="text-sm text-muted-foreground">
            View internet service configuration, pricing, and metadata.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button asChild variant="outline">
            <Link href={`/admin/services/internet/${id}/edit`}>
              Edit Internet Service
            </Link>
          </Button>
          <Button asChild variant="ghost">
            <Link href="/admin/services?tab=internet">Back to services</Link>
          </Button>
        </div>
      </div>

      <InternetServiceDetailCard service={response.data} />
    </div>
  );
}

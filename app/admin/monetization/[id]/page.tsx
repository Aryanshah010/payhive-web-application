import Link from "next/link";
import { notFound } from "next/navigation";
import { Button } from "@/components/ui/button";
import FeeConfigDetailCard from "../_components/FeeConfigDetailCard";
import { handleGetOneFeeConfig } from "@/lib/actions/admin/fee-config-action";

export default async function FeeConfigDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const { id } = await params;
  const response = await handleGetOneFeeConfig(id);

  if (!response.success || !response.data) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-2">
        <div>
          <h1 className="text-2xl font-semibold">Fee Config Details</h1>
          <p className="text-sm text-muted-foreground">
            Review service payment fee configuration.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button asChild variant="outline">
            <Link href={`/admin/monetization/${id}/edit`}>Edit</Link>
          </Button>
          <Button asChild variant="ghost">
            <Link href="/admin/monetization">Back to monetization</Link>
          </Button>
        </div>
      </div>

      <FeeConfigDetailCard config={response.data} />
    </div>
  );
}

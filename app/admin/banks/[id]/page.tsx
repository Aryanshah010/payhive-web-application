import Link from "next/link";
import { notFound } from "next/navigation";
import { Button } from "@/components/ui/button";
import BankDetailCard from "../_components/BankDetailCard";
import { handleGetOneBank } from "@/lib/actions/admin/bank-action";

export default async function BankDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const { id } = await params;
  const response = await handleGetOneBank(id);

  if (!response.success || !response.data) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-2">
        <div>
          <h1 className="text-2xl font-semibold">Bank Details</h1>
          <p className="text-sm text-muted-foreground">
            View transfer rules and configuration details.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button asChild variant="outline">
            <Link href={`/admin/banks/${id}/edit`}>Edit Bank</Link>
          </Button>
          <Button asChild variant="ghost">
            <Link href="/admin/banks">Back to banks</Link>
          </Button>
        </div>
      </div>

      <BankDetailCard bank={response.data} />
    </div>
  );
}

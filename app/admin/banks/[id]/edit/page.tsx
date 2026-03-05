import Link from "next/link";
import { notFound } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import EditBankForm from "../../_components/EditBankForm";
import { handleGetOneBank } from "@/lib/actions/admin/bank-action";

export default async function EditBankPage({
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
    <div className="space-y-4">
      <Button asChild variant="ghost">
        <Link href={`/admin/banks/${id}`}>Back to bank details</Link>
      </Button>

      <Card className="mx-auto w-full max-w-3xl border-border/70">
        <CardHeader>
          <CardTitle>Edit Bank</CardTitle>
          <CardDescription>
            Update transfer rules and availability.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <EditBankForm bank={response.data} bankId={id} />
        </CardContent>
      </Card>
    </div>
  );
}

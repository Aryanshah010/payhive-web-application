import Link from "next/link";
import { notFound } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import EditInternetServiceForm from "../../../_components/EditInternetServiceForm";
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
    <div className="space-y-4">
      <Button asChild variant="ghost">
        <Link href={`/admin/services/internet/${id}`}>
          Back to internet service details
        </Link>
      </Button>

      <Card className="mx-auto w-full max-w-3xl border-border/70">
        <CardHeader>
          <CardTitle>Update Internet Service</CardTitle>
          <p className="text-sm text-muted-foreground">
            Update internet service details, pricing, and validation rules.
          </p>
        </CardHeader>

        <CardContent>
          <EditInternetServiceForm service={response.data} serviceId={id} />
        </CardContent>
      </Card>
    </div>
  );
}

import Link from "next/link";
import { notFound } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import EditTopupServiceForm from "../../../_components/EditTopupServiceForm";
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
    <div className="space-y-4">
      <Button asChild variant="ghost">
        <Link href={`/admin/services/topup/${id}`}>
          Back to mobile data/topup details
        </Link>
      </Button>

      <Card className="mx-auto w-full max-w-3xl border-border/70">
        <CardHeader>
          <CardTitle>Update Mobile Data/Topup Service</CardTitle>
          <p className="text-sm text-muted-foreground">
            Update mobile data/topup details, pricing, and validation rules.
          </p>
        </CardHeader>

        <CardContent>
          <EditTopupServiceForm service={response.data} serviceId={id} />
        </CardContent>
      </Card>
    </div>
  );
}

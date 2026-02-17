import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import CreateTopupServiceForm from "../../_components/CreateTopupServiceForm";

export default function Page() {
  return (
    <div className="space-y-4">
      <Button asChild variant="ghost">
        <Link href="/admin/services?tab=topup">Back to services</Link>
      </Button>

      <Card className="mx-auto w-full max-w-3xl border-border/70">
        <CardHeader>
          <CardTitle>Create Mobile Data/Topup Service</CardTitle>
          <p className="text-sm text-muted-foreground">
            Add a mobile data/topup plan for customer payments.
          </p>
        </CardHeader>
        <CardContent>
          <CreateTopupServiceForm />
        </CardContent>
      </Card>
    </div>
  );
}

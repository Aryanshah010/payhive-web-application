import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import CreateInternetServiceForm from "../../_components/CreateInternetServiceForm";

export default function Page() {
  return (
    <div className="space-y-4">
      <Button asChild variant="ghost">
        <Link href="/admin/services?tab=internet">Back to services</Link>
      </Button>

      <Card className="mx-auto w-full max-w-3xl border-border/70">
        <CardHeader>
          <CardTitle>Create Internet Service</CardTitle>
          <p className="text-sm text-muted-foreground">
            Add an internet service plan for customer payments.
          </p>
        </CardHeader>
        <CardContent>
          <CreateInternetServiceForm />
        </CardContent>
      </Card>
    </div>
  );
}

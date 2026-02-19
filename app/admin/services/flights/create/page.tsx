import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import CreateFlightForm from "../../_components/CreateFlightForm";

export default function Page() {
  return (
    <div className="space-y-4">
      <Button asChild variant="ghost">
        <Link href="/admin/services?tab=flights">Back to services</Link>
      </Button>

      <Card className="mx-auto w-full max-w-3xl border-border/70">
        <CardHeader>
          <CardTitle>Create Flight</CardTitle>
          <p className="text-sm text-muted-foreground">
            Add a flight to your booking inventory.
          </p>
        </CardHeader>
        <CardContent>
          <CreateFlightForm />
        </CardContent>
      </Card>
    </div>
  );
}

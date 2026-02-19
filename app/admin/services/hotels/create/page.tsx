import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import CreateHotelForm from "../../_components/CreateHotelForm";

export default function Page() {
  return (
    <div className="space-y-4">
      <Button asChild variant="ghost">
        <Link href="/admin/services?tab=hotels">Back to services</Link>
      </Button>

      <Card className="mx-auto w-full max-w-3xl border-border/70">
        <CardHeader>
          <CardTitle>Create Hotel</CardTitle>
          <p className="text-sm text-muted-foreground">
            Add a hotel record to your booking inventory.
          </p>
        </CardHeader>
        <CardContent>
          <CreateHotelForm />
        </CardContent>
      </Card>
    </div>
  );
}

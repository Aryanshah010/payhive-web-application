import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import CreateFeeConfigForm from "../_components/CreateFeeConfigForm";

export default function CreateFeeConfigPage() {
  return (
    <div className="space-y-4">
      <Button asChild variant="ghost">
        <Link href="/admin/monetization">Back to monetization</Link>
      </Button>

      <Card className="mx-auto w-full max-w-3xl border-border/70">
        <CardHeader>
          <CardTitle>Create Fee Config</CardTitle>
          <p className="text-sm text-muted-foreground">
            Define fixed fees for service payments.
          </p>
        </CardHeader>
        <CardContent>
          <CreateFeeConfigForm />
        </CardContent>
      </Card>
    </div>
  );
}

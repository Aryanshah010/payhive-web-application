import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import CreateBankForm from "../_components/CreateBankForm";

export default function CreateBankPage() {
  return (
    <div className="space-y-4">
      <Button asChild variant="ghost">
        <Link href="/admin/banks">Back to banks</Link>
      </Button>

      <Card className="mx-auto w-full max-w-3xl border-border/70">
        <CardHeader>
          <CardTitle>Create Bank</CardTitle>
          <p className="text-sm text-muted-foreground">
            Add a bank and define transfer validation limits.
          </p>
        </CardHeader>
        <CardContent>
          <CreateBankForm />
        </CardContent>
      </Card>
    </div>
  );
}

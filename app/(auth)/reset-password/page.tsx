import { CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import ResetPasswordForm from "../_components/ResetPasswordForm";
import { Suspense } from "react";

export default function Page() {
  return (
    <div className="space-y-6 w-full">
      <CardHeader>
        <CardTitle className="font-bold text-xl">Reset password</CardTitle>
        <CardDescription className="font-normal">
          Choose a new password for your account.
        </CardDescription>
      </CardHeader>
      <Suspense fallback={<p className="text-sm text-muted-foreground">Loading reset form...</p>}>
        <ResetPasswordForm />
      </Suspense>
    </div>
  );
}

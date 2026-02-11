import { CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import ResetPasswordForm from "../_components/ResetPasswordForm";

export default function Page() {
  return (
    <div className="space-y-6 w-full">
      <CardHeader>
        <CardTitle className="font-bold text-xl">Reset password</CardTitle>
        <CardDescription className="font-normal">
          Choose a new password for your account.
        </CardDescription>
      </CardHeader>
      <ResetPasswordForm />
    </div>
  );
}

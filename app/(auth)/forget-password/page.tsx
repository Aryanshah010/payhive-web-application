import { CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import ForgotPasswordForm from "../_components/ForgotPasswordForm";

export default function Page() {
  return (
    <div className="space-y-6 w-full">
      <CardHeader>
        <CardTitle className="font-bold text-xl">Forgot password?</CardTitle>
        <CardDescription className="font-normal">
          Enter your email and we will send you a reset link.
        </CardDescription>
      </CardHeader>
      <ForgotPasswordForm />
    </div>
  );
}

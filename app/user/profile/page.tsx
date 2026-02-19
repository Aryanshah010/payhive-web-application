import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import UpdateProfileForm from "../_components/UpdateProfile";
import { handleWhoAmI } from "@/lib/actions/user-action";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function ProfilePage() {
  const result = await handleWhoAmI();
  if (!result.success) {
    throw new Error("Error fetching user data");
  }
  if (!result.data) {
    notFound();
  }

  return (
    <div className="mx-auto w-full max-w-2xl">
      <Card className="border-border/60 bg-card/80 shadow-xl shadow-black/5 backdrop-blur-sm">
        <CardHeader className="space-y-1 pb-6">
          <CardTitle className="text-2xl font-bold tracking-tight text-center">
            Your Profile
          </CardTitle>
          <CardDescription className="text-center">
            Manage your personal information and profile picture
          </CardDescription>
        </CardHeader>
        <CardContent>
          <UpdateProfileForm user={result.data} />
        </CardContent>
      </Card>
    </div>
  );
}

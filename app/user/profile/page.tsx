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

export default async function ProfilePage() {
  const result = await handleWhoAmI();
  if (!result.success) {
    throw new Error("Error fetching user data");
  }
  if (!result.data) {
    notFound();
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center bg-linear-to-b from-background to-muted/30 p-4 md:p-6">
      <Card className="w-full max-w-lg border-border/60 shadow-xl shadow-black/5 backdrop-blur-sm bg-card/80">
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

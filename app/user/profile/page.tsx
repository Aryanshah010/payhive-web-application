import { CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
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
    <div className="space-y-6 w-full max-w-2xl mx-auto p-6">
      <CardHeader className="px-0">
        <CardTitle className="font-bold text-xl">Your Profile</CardTitle>
        <CardDescription>
          Update your personal details, including profile picture.
        </CardDescription>
      </CardHeader>

      <UpdateProfileForm user={result.data} />
    </div>
  );
}

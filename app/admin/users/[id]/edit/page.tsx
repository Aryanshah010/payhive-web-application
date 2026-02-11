import { notFound } from "next/navigation";
import { handleGetOneUser } from "@/lib/actions/admin/user-action";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import EditUserForm from "../../_components/EditUserForm";

export default async function Page({
  params,
}: {
  params: { id: string };
}) {
  const { id } =await params;
  const result = await handleGetOneUser(id);

  if (!result.success || !result.data) {
    notFound();
  }

  return (
     <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center bg-linear-to-b from-background to-muted/30 p-4 md:p-6">
      <Card className="w-full max-w-lg border-border/60 shadow-xl shadow-black/5 backdrop-blur-sm bg-card/80">
        <CardHeader className="space-y-1 pb-6">
          <CardTitle className="text-2xl font-bold tracking-tight text-center">
            Update User
          </CardTitle>
          <CardDescription className="text-center">
            Manage user personal information and profile picture
          </CardDescription>
        </CardHeader>
        <CardContent>
          <EditUserForm user={result.data} userId={id} />
        </CardContent>
      </Card>
    </div>
  );
}

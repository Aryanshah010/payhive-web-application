"use client";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import CreateUserForm from "../_components/CreateUserForm";

export default function Page() {
  return (
    <div className="min-h-screen flex items-start justify-center pt-20 px-4 bg-background">
      <Card className="w-full max-w-xl mx-auto">
        <CardHeader>
          <CardTitle className="font-bold text-lg">Create User</CardTitle>
        </CardHeader>

        <CardContent>
          <CreateUserForm />
        </CardContent>
      </Card>
    </div>
  );
}

"use client";

import { CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import RegisterForm from "../_components/RegisterForm";

export default function Page() {
  return (
    <div className="space-y-6 w-full">
      <CardHeader>
        <CardTitle className="font-bold text-xl">Sign Up</CardTitle>
        <CardDescription className="font-normal ">Create your account to get started</CardDescription>
      </CardHeader>
      <RegisterForm />
    </div>
  );
}

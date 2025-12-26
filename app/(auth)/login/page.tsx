"use client";

import { CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import LoginForm from "../_components/LoginForm";


export default function Page() {
  return (
    <div className="space-y-6 w-full">
      <CardHeader>
        <CardTitle className="font-bold text-xl">Login</CardTitle>
        <CardDescription className="font-normal ">Welcome! login to continue</CardDescription>
      </CardHeader>
      <LoginForm/>

    </div>
  );
}

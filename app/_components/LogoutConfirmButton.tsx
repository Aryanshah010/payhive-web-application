"use client";

import { useId } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { handleLogout } from "@/lib/actions/auth-action";

type LogoutConfirmButtonProps = {
  size?: "default" | "sm" | "lg";
};

export default function LogoutConfirmButton({
  size = "sm",
}: LogoutConfirmButtonProps) {
  const formId = useId().replace(/:/g, "");

  return (
    <>
      <form id={formId} action={handleLogout} />

      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button size={size}>Logout</Button>
        </AlertDialogTrigger>

        <AlertDialogContent size="sm">
          <AlertDialogHeader>
            <AlertDialogTitle>Log out?</AlertDialogTitle>
            <AlertDialogDescription>
              You will be signed out and redirected to the login page.
            </AlertDialogDescription>
          </AlertDialogHeader>

          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction type="submit" form={formId} variant="destructive">
              Logout
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

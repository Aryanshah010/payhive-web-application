/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ResetPasswordType, resetPasswordSchema } from "../Schema";
import { Input } from "@/components/ui/input";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { useState, useTransition } from "react";
import Link from "next/link";
import { handleResetPassword } from "@/lib/actions/auth-action";
import { useSearchParams } from "next/navigation";
import { toast } from "react-toastify";
import { LoadingButton } from "@/app/_components/LoadingButton";

export default function ResetPasswordForm() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token") ?? "";
  const tokenMissing = !token;

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting, touchedFields },
  } = useForm<ResetPasswordType>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      newPassword: "",
      confirmPassword: "",
    },
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [pending, setTransition] = useTransition();

  const onSubmit = async (values: ResetPasswordType) => {
    setError("");
    setSuccess("");

    if (!token) {
      setError("Missing or invalid reset token.");
      return;
    }

    setTransition(async () => {
      try {
        const response = await handleResetPassword({
          token,
          newPassword: values.newPassword,
        });
        if (!response.success) {
          throw new Error(response.message);
        }
        setSuccess(response.message || "Password has been reset successfully.");
        toast("Password has been reset successfully.");
        reset();
      } catch (err: Error | any) {
        setError(err.message || "Failed to reset password");
      }
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {(tokenMissing || error) && (
        <p className="text-sm text-destructive">
          {error || "Missing or invalid reset token."}
        </p>
      )}
      {success && <p className="text-sm text-emerald-600">{success}</p>}

      <FieldGroup>
        <Field className="space-y-0">
          <FieldLabel>New Password</FieldLabel>
          <Input
            {...register("newPassword")}
            placeholder="••••••••••••"
            type="password"
            autoComplete="new-password"
            disabled={isSubmitting}
          />
          {touchedFields.newPassword && errors.newPassword && (
            <p className="text-sm text-destructive">
              {errors.newPassword.message}
            </p>
          )}
        </Field>

        <Field className="space-y-1.5">
          <FieldLabel>Confirm Password</FieldLabel>
          <Input
            {...register("confirmPassword")}
            placeholder="••••••••••••"
            autoComplete="new-password"
            type="password"
            disabled={isSubmitting}
          />
          {touchedFields.confirmPassword && errors.confirmPassword && (
            <p className="text-sm text-destructive">
              {errors.confirmPassword.message}
            </p>
          )}
        </Field>
      </FieldGroup>

      <LoadingButton
        type="submit"
        loading={isSubmitting || pending}
        loadingText="Resetting password..."
        disabled={tokenMissing}
      >
        Reset Password
      </LoadingButton>

      <div className="mt-6 text-center text-sm text-muted-foreground">
        Back to{" "}
        <Link
          href="/login"
          className="font-medium text-(--color-primary) hover:underline"
        >
          Log in
        </Link>
      </div>
    </form>
  );
}

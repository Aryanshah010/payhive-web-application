/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ForgotPasswordType, forgotPasswordSchema } from "../Schema";
import { Input } from "@/components/ui/input";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { useState, useTransition } from "react";
import Link from "next/link";
import { handleRequestPasswordReset } from "@/lib/actions/auth-action";
import { LoadingButton } from "@/app/_components/LoadingButton";

export default function ForgotPasswordForm() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting, touchedFields },
  } = useForm<ForgotPasswordType>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: "",
    },
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [pending, setTransition] = useTransition();

  const onSubmit = async (values: ForgotPasswordType) => {
    setError("");
    setSuccess("");

    setTransition(async () => {
      try {
        const response = await handleRequestPasswordReset(values);
        if (!response.success) {
          throw new Error(response.message);
        }
        setSuccess(
          response.message ||
            "If the email is registered, a reset link has been sent.",
        );
        reset();
      } catch (err: Error | any) {
        setError(err.message || "Failed to send reset link");
      }
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {error && <p className="text-sm text-destructive">{error}</p>}
      {success && <p className="text-sm text-emerald-600">{success}</p>}

      <FieldGroup>
        <Field className="space-y-0">
          <FieldLabel>Email</FieldLabel>
          <Input
            {...register("email")}
            placeholder="jane@example.com"
            autoComplete="email"
            type="email"
            disabled={isSubmitting}
          />
          {touchedFields.email && errors.email && (
            <p className="text-sm text-destructive">{errors.email.message}</p>
          )}
        </Field>
      </FieldGroup>

      <LoadingButton
        type="submit"
        loading={isSubmitting || pending}
        loadingText="Sending reset link..."
        className="w-full mt-6"
      >
        Send Reset Link
      </LoadingButton>

      <div className="mt-6 text-center text-sm text-muted-foreground">
        Remember your password?{" "}
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

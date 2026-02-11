/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { LoginType, loginSchema } from "../Schema";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { useState, useTransition } from "react";
import Link from "next/link";
import { handleLogin } from "@/lib/actions/auth-action";
import { LoadingButton } from "@/app/_components/LoadingButton";

export default function LoginForm() {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, touchedFields },
  } = useForm<LoginType>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      phoneNumber: "",
      password: "",
    },
  });

  const [error, setError] = useState("");
  const [pending, setTransition] = useTransition();

  const onSubmit = async (values: LoginType) => {
    setError("");

    // GOTO
    setTransition(async () => {
      try {
        const response = await handleLogin(values);
        if (!response.success) {
          throw new Error(response.message);
        }
        if (response.success) {
          router.push("/user/dashboard");
        } else {
          setError("Login failed");
        }
      } catch (err: Error | any) {
        setError(err.message || "Login failed");
      }
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {error && <p className="text-sm text-destructive">{error}</p>}

      <FieldGroup>
        <Field className="space-y-0">
          <FieldLabel>Phone Number</FieldLabel>
          <Input
            {...register("phoneNumber")}
            placeholder="eg: 9876543210"
            autoComplete="off"
            inputMode="numeric"
            type="tel"
            disabled={isSubmitting}
          />
          {touchedFields.phoneNumber && errors.phoneNumber && (
            <p className="text-sm text-destructive">
              {errors.phoneNumber.message}
            </p>
          )}
        </Field>

        <Field className="space-y-0">
          <FieldLabel>Password</FieldLabel>
          <Input
            {...register("password")}
            placeholder="••••••••••••"
            type="password"
            autoComplete="new-password"
            disabled={isSubmitting}
          />
          {touchedFields.password && errors.password && (
            <p className="text-sm text-destructive ">
              {errors.password.message}
            </p>
          )}
        </Field>
      </FieldGroup>

      <div className="text-right">
        <Link
          href="/forget-password"
          className="text-sm font-medium text-(--color-primary) hover:underline"
        >
          Forgot password?
        </Link>
      </div>

      <LoadingButton
        type="submit"
        loading={isSubmitting || pending}
        loadingText="Logging in..."
        className="mt-6"
      >
        Log In
      </LoadingButton>

      <div className="mt-6 text-center text-sm text-muted-foreground">
        Don’t have an account?{" "}
        <Link
          href="/register"
          className="font-medium text-(--color-primary) hover:underline"
        >
          Sign Up
        </Link>
      </div>
    </form>
  );
}

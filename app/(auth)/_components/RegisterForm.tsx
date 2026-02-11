/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { RegisterType, registerScheme } from "../Schema";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { useState, useTransition } from "react";
import Link from "next/link";
import { handleRegister } from "@/lib/actions/auth-action";
import { LoadingButton } from "@/app/_components/LoadingButton";

export default function RegisterForm() {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, touchedFields },
  } = useForm<RegisterType>({
    resolver: zodResolver(registerScheme),
    defaultValues: {
      fullName: "",
      phoneNumber: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const [error, setError] = useState("");
  const [pending, setTransition] = useTransition();

  const onSubmit = async (values: RegisterType) => {
    setError("");
    setTransition(async () => {
      try {
        const response = await handleRegister(values);
        if (!response.success) {
          throw new Error(response.message);
        }
        if (response.success) {
          router.push("/login");
        } else {
          setError("Registration failed");
        }
      } catch (err: Error | any) {
        setError(err.message || "Registration failed");
      }
    });
    // GO TO LOGIN PAGE
    console.log("register", values);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {error && <p className="text-sm text-destructive">{error}</p>}

      <FieldGroup>
        <Field className="space-y-0">
          <FieldLabel>Full Name</FieldLabel>
          <Input
            {...register("fullName")}
            placeholder="Jane Doe"
            autoComplete="off"
            disabled={isSubmitting}
          />
          {touchedFields.fullName && errors.fullName && (
            <p className="text-sm text-destructive">
              {errors.fullName.message}
            </p>
          )}
        </Field>

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
            <p className="text-sm text-destructive ">
              {errors.confirmPassword.message}
            </p>
          )}
        </Field>
      </FieldGroup>

      <LoadingButton
        type="submit"
        loading={isSubmitting || pending}
        loadingText="Creating account..."
        className="mt-12"
      >
        Create Account
      </LoadingButton>

      <div className="mt-6 text-center text-sm text-muted-foreground">
        Already have an account?{" "}
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

"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { RegisterType, registerScheme } from "../Schema";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Button } from "@/components/ui/button";
import { useTransition } from "react";
import Link from "next/link";

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
      Password: "",
      confirmPassword: "",
    },
  });

  const [pending, setTransition] = useTransition();

  const onSubmit = async (values: RegisterType) => {
    setTransition(async () => {
      await new Promise((resolve) => setTimeout(resolve, 2000));
      router.push("/login");
    });
    console.log("register", values);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
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
          <FieldLabel>Password</FieldLabel>
          <Input
            {...register("Password")}
            placeholder="••••••••••••"
            type="password"
            autoComplete="new-password"
            disabled={isSubmitting}
          />
          {touchedFields.Password && errors.Password && (
            <p className="text-sm text-destructive ">
              {errors.Password.message}
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

     <Button
        type="submit"
        disabled={isSubmitting || pending}
        className="w-full mt-12"
      >
        <span className="flex items-center justify-center gap-2">
          {isSubmitting || pending ? (
            <>
              <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                  fill="none"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
              Creating account...
            </>
          ) : (
            "Sign Up"
          )}
        </span>
      </Button>

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

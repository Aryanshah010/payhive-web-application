"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { LoginType, loginSchema } from "../Schema";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Button } from "@/components/ui/button";
import { useTransition } from "react";
import Link from "next/link";

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
      Password: "",
    },
  });

  const [pending, setTransition] = useTransition();

  const onSubmit = async (values: LoginType) => {
    setTransition(async () => {
      await new Promise((resolve) => setTimeout(resolve, 2000));
      router.push("/dashboard");
    });
    console.log("register", values);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
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
      </FieldGroup>

      <Button
        type="submit"
        disabled={isSubmitting || pending}
        className="w-full mt-12 rounded "
      >
        {isSubmitting || pending ? "Loggin..." : "Login"}
      </Button>

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

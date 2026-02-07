/* eslint-disable @next/next/no-img-element */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { Controller, useForm } from "react-hook-form";
import { UserData, UserSchema } from "@/app/admin/users/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRef, useState, useTransition } from "react";
import { Input } from "@/components/ui/input";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Button } from "@/components/ui/button";
import { toast } from "react-toastify";
import axios from "../../../../lib/api/axios";
import { LoadingButton } from "@/app/_components/LoadingButton";

export default function CreateUserForm() {
  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors, isSubmitting, touchedFields },
  } = useForm<UserData>({
    resolver: zodResolver(UserSchema),
    defaultValues: {
      fullName: "",
      phoneNumber: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const [pending, startTransition] = useTransition();
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const onSubmit = async (data: UserData) => {
    startTransition(async () => {
      try {
        const formData = new FormData();
        formData.append("fullName", data.fullName);
        formData.append("phoneNumber", data.phoneNumber);
        formData.append("email", data.email);
        formData.append("password", data.password);
        formData.append("confirmPassword", data.confirmPassword);

        if (data.imageUrl) {
          formData.append("profilePicture", data.imageUrl);
        }

        const res = await axios.post(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/admin/users`,
          formData,
        );

        if (!res.data.success) {
          toast.error(res.data.message);
          return;
        }

        toast.success("User created successfully");
        reset();
        setPreviewImage(null);
      } catch (err: any) {
        toast.error(err?.message || "Create failed");
      }
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {/* Avatar */}
      <Controller
        name="imageUrl"
        control={control}
        render={({ field: { onChange } }) => (
          <div className="flex items-center gap-5">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              hidden
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (!file) return;
                onChange(file);
                const reader = new FileReader();
                reader.onloadend = () =>
                  setPreviewImage(reader.result as string);
                reader.readAsDataURL(file);
              }}
            />

            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="relative w-20 h-20 rounded-full overflow-hidden border bg-muted flex items-center justify-center hover:opacity-90 transition"
            >
              {previewImage ? (
                <img
                  src={previewImage}
                  className="w-full h-full object-cover"
                  alt="Avatar preview"
                />
              ) : (
                <span className="text-xs text-muted-foreground">Upload</span>
              )}
            </button>

            {previewImage && (
              <Button
                type="button"
                size="sm"
                variant="ghost"
                onClick={() => {
                  setPreviewImage(null);
                  onChange(undefined);
                  if (fileInputRef.current) fileInputRef.current.value = "";
                }}
              >
                Remove
              </Button>
            )}
          </div>
        )}
      />

      {/* Fields */}
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
            placeholder="jane.doe@example.com"
            autoComplete="off"
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
        className="mt-6"
      >
        Create User
      </LoadingButton>
    </form>
  );
}

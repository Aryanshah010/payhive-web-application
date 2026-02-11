/* eslint-disable @next/next/no-img-element */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { Input } from "@/components/ui/input";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { AdminUserEditData, AdminUserEditSchema } from "../schema";
import { LoadingButton } from "@/app/_components/LoadingButton";
import { handleUpdateOneUser } from "@/lib/actions/admin/user-action";
import { Button } from "@/components/ui/button";

export default function EditUserForm({
  user,
  userId,
}: {
  user: any;
  userId: string;
}) {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting, touchedFields },
  } = useForm<any>({
    resolver: zodResolver(AdminUserEditSchema),
    defaultValues: {
      fullName: user?.fullName || "",
      phoneNumber: user?.phoneNumber || "",
      email: user?.email || "",
      role: user?.role || "user",
      password: "",
      confirmPassword: "",
      imageUrl: undefined,
    },
  });

  const [error, setError] = useState<string | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const currentImage =
    previewImage ||
    (user?.imageUrl
      ? `${process.env.NEXT_PUBLIC_BACKEND_URL}${user.imageUrl}`
      : null);

  const onSubmit = async (data: AdminUserEditData) => {
    setError(null);

    const formData = new FormData();
    formData.append("fullName", data.fullName);
    formData.append("phoneNumber", data.phoneNumber);
    formData.append("email", data.email);
    formData.append("role", data.role);

    if (data.password) {
      formData.append("password", data.password);
    }

    if (data.imageUrl) {
      formData.append("profilePicture", data.imageUrl);
    }

    startTransition(async () => {
      try {
        const res = await handleUpdateOneUser(userId, formData);
        if (!res.success) {
          toast.error(res.message || "Update failed");
          setError(res.message || "Update failed");
          return;
        }

        toast.success("User updated successfully");
        router.push(`/admin/users/${userId}`);
      } catch (err: Error | any) {
        const message = err.message || "Update failed";
        toast.error(message);
        setError(message);
      }
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {error && <p className="text-sm text-destructive">{error}</p>}

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
              id="user-avatar"
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
              onClick={() => {
                fileInputRef.current?.click();
              }}
              className="relative w-20 h-20 rounded-full overflow-hidden border bg-muted flex items-center justify-center hover:opacity-90 transition"
            >
              {currentImage ? (
                <img
                  src={currentImage}
                  className="w-full h-full object-cover"
                  alt="User avatar"
                />
              ) : (
                <span className="text-xs text-muted-foreground">Upload</span>
              )}
            </button>

            {currentImage && (
              <Button
                type="button"
                size="sm"
                variant="ghost"
                onClick={() => {
                  setPreviewImage(null);
                  onChange(undefined);
                }}
              >
                Remove
              </Button>
            )}
          </div>
        )}
      />

      {errors.imageUrl && typeof errors.imageUrl.message === "string" && (
        <p className="text-sm text-destructive">{errors.imageUrl.message}</p>
      )}

      <FieldGroup>
        <Field className="space-y-0">
          <FieldLabel>Full Name</FieldLabel>
          <Input
            {...register("fullName")}
            placeholder="Jane Doe"
            autoComplete="off"
            disabled={isSubmitting}
          />
          {touchedFields.fullName &&
          typeof errors.fullName?.message === "string" && (
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
          {touchedFields.phoneNumber &&
          typeof errors.phoneNumber?.message === "string" && (
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
          {touchedFields.email &&
          typeof errors.email?.message === "string" && (
            <p className="text-sm text-destructive">{errors.email.message}</p>
          )}
        </Field>

        <Field className="space-y-0">
          <FieldLabel>Role</FieldLabel>
          <Controller
            name="role"
            control={control}
            render={({ field: { value, onChange } }) => (
              <Select value={value} onValueChange={onChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Select role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="user">User</SelectItem>
                  <SelectItem value="admin">Admin</SelectItem>
                </SelectContent>
              </Select>
            )}
          />
        {touchedFields.role && typeof errors.role?.message === "string" && (
            <p className="text-sm text-destructive">{errors.role.message}</p>
          )}
        </Field>

        <Field className="space-y-0">
          <FieldLabel>Password (Optional)</FieldLabel>
          <Input
            {...register("password")}
            placeholder="••••••••••••"
            type="password"
            autoComplete="new-password"
            disabled={isSubmitting}
          />
          {touchedFields.password &&
          typeof errors.password?.message === "string" && (
            <p className="text-sm text-destructive">
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
          {touchedFields.confirmPassword &&
          typeof errors.confirmPassword?.message === "string" && (
            <p className="text-sm text-destructive">
              {errors.confirmPassword.message}
            </p>
          )}
        </Field>
      </FieldGroup>

      <LoadingButton
        type="submit"
        loading={isSubmitting || pending}
        loadingText="Updating user..."
        className="mt-6"
      >
        Update User
      </LoadingButton>
    </form>
  );
}

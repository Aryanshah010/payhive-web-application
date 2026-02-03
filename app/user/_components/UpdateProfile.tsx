/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { useState, useTransition } from "react";
import Image from "next/image";
import { toast } from "react-toastify";
import { handleUpdateProfile } from "@/lib/actions/user-action";
import { UpdateUserData, updateUserSchema } from "../schema";
import { Input } from "@/components/ui/input";
import { Field, FieldLabel } from "@/components/ui/field";
import { Button } from "@/components/ui/button";

export default function UpdateProfileForm({ user }: { user: any }) {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting, touchedFields },
  } = useForm<UpdateUserData>({
    resolver: zodResolver(updateUserSchema),
    defaultValues: {
      fullName: user?.fullName || "",
    },
  });

  const [error, setError] = useState<string | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [inputKey, setInputKey] = useState(0);
  const [pending] = useTransition();

  const handleImageChange = (
    file: File | undefined,
    onChange: (file: File | undefined) => void,
  ) => {
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result as string);
      };
      reader.readAsDataURL(file);
      onChange(file);
    } else {
      setPreviewImage(null);
      onChange(undefined);
    }
  };

  const handleDismissImage = (onChange?: (file: File | undefined) => void) => {
    setPreviewImage(null);
    onChange?.(undefined);
    setInputKey((k) => k + 1);
  };

  const onSubmit = async (data: UpdateUserData) => {
    setError(null);

    const formData = new FormData();
    formData.append("fullName", data.fullName);

    if (data.imageUrl) {
      formData.append("imageUrl", data.imageUrl);
    }
    try {
      const res = await handleUpdateProfile(formData);
      if (!res.success) {
        toast.error(res.message);
        return;
      }
      setPreviewImage(null);
      setInputKey((k) => k + 1);
      toast.success("Profile updated successfully");
    } catch (error: Error | any) {
      toast.error(error.message || "Profile update failed");
      setError(error.message || "Profile update failed");
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {error && <p className="text-sm text-destructive">{error}</p>}
      {/* Profile Image Display */}
      <div className="mb-4">
        {previewImage ? (
          <div className="relative w-24 h-24">
            <Image
              src={previewImage}
              alt="Profile Image Preview"
              width={96}
              height={96}
              className="w-24 h-24 rounded-full object-cover"
            />
            <Controller
              name="imageUrl"
              control={control}
              render={({ field: { onChange } }) => (
                <button
                  type="button"
                  onClick={() => handleDismissImage(onChange)}
                  className="absolute top-0 right-0 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm hover:bg-red-600"
                >
                  ✕
                </button>
              )}
            />
          </div>
        ) : user?.imageUrl ? (
          <Image
            src={process.env.NEXT_PUBLIC_API_BASE_URL + user.imageUrl}
            alt="Profile Image"
            width={100}
            height={100}
            className="w-24 h-24 rounded-full object-cover"
          />
        ) : (
          <div className="w-24 h-24 bg-gray-300 rounded-full flex items-center justify-center">
            <span className="text-gray-600">No Image</span>
          </div>
        )}
      </div>

      {/* Profile Image Input */}
      <div className="mb-4">
        <label className="block text-sm font-medium mb-1">Profile Image</label>
        <Controller
          name="imageUrl"
          control={control}
          render={({ field: { onChange } }) => (
            <input
              key={inputKey}
              type="file"
              onChange={(e) => handleImageChange(e.target.files?.[0], onChange)}
              accept=".jpg,.jpeg,.png,.webp"
            />
          )}
        />
        {typeof errors.imageUrl?.message === "string" && (
          <p className="text-sm text-destructive">{errors.imageUrl.message}</p>
        )}
      </div>

      <Field className="space-y-0">
        <FieldLabel>Full Name</FieldLabel>
        <Input
          {...register("fullName")}
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
              updating profile...
            </>
          ) : (
            "Update Profile"
          )}
        </span>
      </Button>
    </form>
  );
}

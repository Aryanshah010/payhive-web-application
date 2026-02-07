/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { useState, useTransition } from "react";
import Image from "next/image";
import { toast } from "react-toastify";
import { handleUpdateProfile } from "@/lib/actions/user-action";
import { Input } from "@/components/ui/input";
import { Field, FieldLabel } from "@/components/ui/field";
import { useRouter } from "next/navigation";
import { UpdateUserFormInput, updateUserSchema } from "../schema";
import { Label } from "@/components/ui/label";
import { Camera, X } from "lucide-react";
import { LoadingButton } from "@/app/_components/LoadingButton";

export default function UpdateProfileForm({ user }: { user: any }) {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting, touchedFields },
  } = useForm<any>({
    resolver: zodResolver(updateUserSchema),
    defaultValues: {
      fullName: user?.fullName || "",
      password: "",
      imageUrl: undefined,
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

  const handleDismissImage = () => {
    setPreviewImage(null);
    setInputKey((k) => k + 1);
  };

  const onSubmit = async (data: UpdateUserFormInput) => {
    setError(null);
    const parsed = updateUserSchema.parse(data);

    const formData = new FormData();

    if (touchedFields.fullName && parsed.fullName) {
      formData.append("fullName", parsed.fullName);
    }

    if (touchedFields.password && parsed.password) {
      formData.append("password", parsed.password);
    }

    if (parsed.imageUrl) {
      formData.append("profilePicture", parsed.imageUrl);
    }

    if ([...formData.keys()].length === 0) {
      toast.info("No changes made to update");
      router.push("/user/dashboard");
      return;
    }

    try {
      const res = await handleUpdateProfile(formData);
      if (!res.success) {
        toast.error(res.message || "Profile update failed");
        return;
      }

      setPreviewImage(null);
      setInputKey((k) => k + 1);
      toast.success("Profile updated successfully");
      router.refresh();
      router.push("/user/dashboard");
    } catch (error: any) {
      toast.error(error.message || "Profile update failed");
      setError(error.message || "Profile update failed");
    }
  };

  const currentImage =
    previewImage ||
    (user?.imageUrl
      ? `${process.env.NEXT_PUBLIC_BACKEND_URL}${user.imageUrl}`
      : null);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {error && <p className="text-sm text-destructive">{error}</p>}

      {/* Profile Upload */}
      <div className="flex flex-col items-center gap-3">
        <div className="relative group">
          <div className="relative w-32 h-32 md:w-40 md:h-40 rounded-full overflow-hidden border-4 border-background shadow-2xl shadow-primary/10 transition-all duration-300 group-hover:shadow-primary/20 group-hover:scale-[1.03]">
            {currentImage ? (
              <Image
                src={currentImage}
                alt="Profile picture"
                fill
                className="object-cover"
                priority
              />
            ) : (
              <div className="w-full h-full bg-muted flex items-center justify-center text-muted-foreground">
                <span className="text-4xl">👤</span>
              </div>
            )}

            <label
              htmlFor="profile-picture"
              className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-200 cursor-pointer rounded-full"
            >
              <Camera size={40} color="white" />
            </label>

            {previewImage && (
              <button
                type="button"
                onClick={() => handleDismissImage()}
                className="absolute -top-2 -right-2 bg-destructive text-destructive-foreground rounded-full w-8 h-8 flex items-center justify-center shadow-lg"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>

          <Controller
            name="imageUrl"
            control={control}
            render={({ field: { onChange } }) => (
              <input
                key={inputKey}
                id="profile-picture"
                type="file"
                accept=".jpg,.jpeg,.png,.webp"
                className="sr-only"
                onChange={(e) =>
                  handleImageChange(e.target.files?.[0], onChange)
                }
              />
            )}
          />
        </div>

        <Label
          htmlFor="profile-picture"
          className="text-sm text-muted-foreground hover:text-foreground cursor-pointer transition-colors"
        >
          {previewImage ? "Change photo" : "Upload new photo"}
        </Label>

        {errors.imageUrl && typeof errors.imageUrl.message === "string" && (
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

      <Field className="space-y-0">
        <FieldLabel>Password (Optional)</FieldLabel>
        <Input
          {...register("password")}
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

      <LoadingButton
        type="submit"
        loading={isSubmitting || pending}
        loadingText="Updating profile..."
        className="mt-12"
      >
        Update Profile
      </LoadingButton>
    </form>
  );
}

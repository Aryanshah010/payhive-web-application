"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
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
import { LoadingButton } from "@/app/_components/LoadingButton";
import type { AdminUtilityService } from "@/lib/types/admin-services";
import { handleUpdateOneInternetService } from "@/lib/actions/admin/service-action";
import {
  editInternetServiceSchema,
  type EditInternetServiceFormInput,
  type EditInternetServiceFormValues,
  metaJsonFromRecord,
  toInternetServiceUpdatePayload,
} from "../schema";

const TEXTAREA_CLASSNAME =
  "dark:bg-input/30 border-input focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive dark:aria-invalid:border-destructive/50 disabled:bg-input/50 dark:disabled:bg-input/80 min-h-24 rounded-lg border bg-transparent px-2.5 py-2 text-sm transition-colors focus-visible:ring-[3px] aria-invalid:ring-[3px] w-full min-w-0 outline-none disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 placeholder:text-muted-foreground";

export default function EditInternetServiceForm({
  service,
  serviceId,
}: {
  service: AdminUtilityService;
  serviceId: string;
}) {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    setError,
    control,
    formState: { errors, isSubmitting, touchedFields },
  } = useForm<EditInternetServiceFormInput, unknown, EditInternetServiceFormValues>({
    resolver: zodResolver(editInternetServiceSchema),
    defaultValues: {
      provider: service.provider,
      name: service.name,
      packageLabel: service.packageLabel,
      amount: service.amount,
      validationRegex: service.validationRegex,
      isActive: service.isActive,
      metaText: metaJsonFromRecord(service.meta),
    },
  });

  const [pending, startTransition] = useTransition();
  const [error, setFormError] = useState<string | null>(null);

  const onSubmit = async (values: EditInternetServiceFormValues) => {
    setFormError(null);

    const mapped = toInternetServiceUpdatePayload(values);
    if (mapped.error || !mapped.payload) {
      setError("metaText", {
        type: "manual",
        message: mapped.error || "Invalid meta JSON",
      });
      return;
    }

    startTransition(async () => {
      const response = await handleUpdateOneInternetService(serviceId, mapped.payload!);

      if (!response.success) {
        const message = response.message || "Failed to update internet service";
        setFormError(message);
        toast.error(message);
        return;
      }

      toast.success("Internet service updated successfully");
      router.push(`/admin/services/internet/${serviceId}`);
      router.refresh();
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {error ? <p className="text-sm text-destructive">{error}</p> : null}

      <FieldGroup>
        <Field className="space-y-0">
          <FieldLabel>Provider</FieldLabel>
          <Input {...register("provider")} placeholder="WorldLink" />
          {touchedFields.provider && errors.provider ? (
            <p className="text-sm text-destructive">{errors.provider.message}</p>
          ) : null}
        </Field>

        <Field className="space-y-0">
          <FieldLabel>Service Name</FieldLabel>
          <Input {...register("name")} placeholder="50 Mbps Home Plan" />
          {touchedFields.name && errors.name ? (
            <p className="text-sm text-destructive">{errors.name.message}</p>
          ) : null}
        </Field>

        <Field className="space-y-0">
          <FieldLabel>Package Label</FieldLabel>
          <Input {...register("packageLabel")} placeholder="Monthly" />
          {touchedFields.packageLabel && errors.packageLabel ? (
            <p className="text-sm text-destructive">
              {errors.packageLabel.message}
            </p>
          ) : null}
        </Field>

        <Field className="space-y-0">
          <FieldLabel>Amount (NPR)</FieldLabel>
          <Input type="number" min={0.01} step="0.01" {...register("amount")} />
          {touchedFields.amount && errors.amount ? (
            <p className="text-sm text-destructive">{errors.amount.message}</p>
          ) : null}
        </Field>

        <Field className="space-y-0">
          <FieldLabel>Validation Regex</FieldLabel>
          <Input
            {...register("validationRegex")}
            placeholder="^[0-9]{8,12}$"
          />
          {touchedFields.validationRegex && errors.validationRegex ? (
            <p className="text-sm text-destructive">
              {errors.validationRegex.message}
            </p>
          ) : null}
        </Field>

        <Field className="space-y-0">
          <FieldLabel>Status</FieldLabel>
          <Controller
            name="isActive"
            control={control}
            render={({ field: { value, onChange } }) => (
              <Select
                value={value ? "true" : "false"}
                onValueChange={(nextValue) => onChange(nextValue === "true")}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="true">Active</SelectItem>
                  <SelectItem value="false">Inactive</SelectItem>
                </SelectContent>
              </Select>
            )}
          />
          {touchedFields.isActive && errors.isActive ? (
            <p className="text-sm text-destructive">{errors.isActive.message}</p>
          ) : null}
        </Field>
      </FieldGroup>

      <Field className="space-y-0">
        <FieldLabel>Meta JSON (Optional)</FieldLabel>
        <textarea
          {...register("metaText")}
          className={TEXTAREA_CLASSNAME}
          placeholder='{"accountType": "home", "speed": "50mbps"}'
        />
        {touchedFields.metaText && errors.metaText ? (
          <p className="text-sm text-destructive">{errors.metaText.message}</p>
        ) : null}
      </Field>

      <LoadingButton
        type="submit"
        loading={isSubmitting || pending}
        loadingText="Updating internet service..."
        className="mt-6"
      >
        Update Internet Service
      </LoadingButton>
    </form>
  );
}

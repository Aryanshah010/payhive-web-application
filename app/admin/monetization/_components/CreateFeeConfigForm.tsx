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
import { handleCreateFeeConfig } from "@/lib/actions/admin/fee-config-action";
import { cn } from "@/lib/utils";
import {
  createFeeConfigSchema,
  type CreateFeeConfigFormInput,
  type CreateFeeConfigFormValues,
  toFeeConfigCreatePayload,
} from "../schema";
import { APPLIES_TO_OPTIONS, FEE_TYPE_LABELS } from "./fee-config-utils";

export default function CreateFeeConfigForm() {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting, touchedFields },
  } = useForm<CreateFeeConfigFormInput, unknown, CreateFeeConfigFormValues>({
    resolver: zodResolver(createFeeConfigSchema),
    defaultValues: {
      type: "service_payment",
      description: "",
      calculation: {
        mode: "fixed",
        fixedAmount: 0,
      },
      appliesTo: [],
      isActive: true,
    },
  });

  const [pending, startTransition] = useTransition();
  const [error, setFormError] = useState<string | null>(null);

  const onSubmit = async (values: CreateFeeConfigFormValues) => {
    setFormError(null);

    startTransition(async () => {
      const payload = toFeeConfigCreatePayload(values);
      const response = await handleCreateFeeConfig(payload);

      if (!response.success) {
        const message = response.message || "Failed to create fee config";
        setFormError(message);
        toast.error(message);
        return;
      }

      toast.success("Fee config created successfully");
      router.push("/admin/monetization");
      router.refresh();
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {error ? <p className="text-sm text-destructive">{error}</p> : null}

      <input type="hidden" {...register("type")} />
      <input type="hidden" {...register("calculation.mode")} />

      <FieldGroup>
        <Field className="space-y-0">
          <FieldLabel>Fee Type</FieldLabel>
          <Input
            readOnly
            value={FEE_TYPE_LABELS.service_payment}
            className="bg-muted/40"
          />
        </Field>

        <Field className="space-y-0">
          <FieldLabel>Description</FieldLabel>
          <Input
            {...register("description")}
            placeholder="Service payment fee for flights"
          />
          {touchedFields.description && errors.description ? (
            <p className="text-sm text-destructive">
              {errors.description.message}
            </p>
          ) : null}
        </Field>

        <Field className="space-y-0">
          <FieldLabel>Fixed Amount (NPR)</FieldLabel>
          <Input
            type="number"
            min={0}
            step="0.01"
            {...register("calculation.fixedAmount")}
          />
          {errors.calculation?.fixedAmount ? (
            <p className="text-sm text-destructive">
              {errors.calculation.fixedAmount.message}
            </p>
          ) : null}
        </Field>

        <Field className="space-y-0">
          <FieldLabel>Applies To</FieldLabel>
          <Controller
            name="appliesTo"
            control={control}
            render={({ field: { value, onChange } }) => (
              <div className="grid gap-2 sm:grid-cols-2">
                {APPLIES_TO_OPTIONS.map((option) => {
                  const checked = value?.includes(option.value);
                  return (
                    <label
                      key={option.value}
                      className={cn(
                        "flex items-center gap-2 rounded-md border px-3 py-2 text-sm",
                        checked
                          ? "border-primary/50 bg-primary/5"
                          : "border-border/70",
                      )}
                    >
                      <input
                        type="checkbox"
                        className="h-4 w-4 accent-primary"
                        checked={checked}
                        onChange={(event) => {
                          if (event.target.checked) {
                            onChange([...(value || []), option.value]);
                          } else {
                            onChange(
                              (value || []).filter(
                                (item) => item !== option.value,
                              ),
                            );
                          }
                        }}
                      />
                      <span>{option.label}</span>
                    </label>
                  );
                })}
              </div>
            )}
          />
          {errors.appliesTo ? (
            <p className="text-sm text-destructive">
              {errors.appliesTo.message as string}
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
            <p className="text-sm text-destructive">
              {errors.isActive.message}
            </p>
          ) : null}
        </Field>
      </FieldGroup>

      <LoadingButton
        type="submit"
        loading={isSubmitting || pending}
        loadingText="Creating fee config..."
        className="mt-6"
      >
        Create Fee Config
      </LoadingButton>
    </form>
  );
}

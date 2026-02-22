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
import type { AdminBank } from "@/lib/types/admin-bank";
import { handleUpdateOneBank } from "@/lib/actions/admin/bank-action";
import {
  editBankSchema,
  type EditBankFormInput,
  type EditBankFormValues,
  toBankUpdatePayload,
} from "../schema";

export default function EditBankForm({
  bank,
  bankId,
}: {
  bank: AdminBank;
  bankId: string;
}) {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting, touchedFields },
  } = useForm<EditBankFormInput, unknown, EditBankFormValues>({
    resolver: zodResolver(editBankSchema),
    defaultValues: {
      name: bank.name,
      code: bank.code,
      accountNumberRegex: bank.accountNumberRegex,
      isActive: bank.isActive,
      minTransfer: bank.minTransfer,
      maxTransfer: bank.maxTransfer,
    },
  });

  const [pending, startTransition] = useTransition();
  const [error, setFormError] = useState<string | null>(null);

  const onSubmit = async (values: EditBankFormValues) => {
    setFormError(null);

    startTransition(async () => {
      const payload = toBankUpdatePayload(values);
      const response = await handleUpdateOneBank(bankId, payload);

      if (!response.success) {
        const message = response.message || "Failed to update bank";
        setFormError(message);
        toast.error(message);
        return;
      }

      toast.success("Bank updated successfully");
      router.push(`/admin/banks/${bankId}`);
      router.refresh();
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {error ? <p className="text-sm text-destructive">{error}</p> : null}

      <FieldGroup>
        <Field className="space-y-0">
          <FieldLabel>Bank Name</FieldLabel>
          <Input {...register("name")} placeholder="Everest Bank" />
          {touchedFields.name && errors.name ? (
            <p className="text-sm text-destructive">{errors.name.message}</p>
          ) : null}
        </Field>

        <Field className="space-y-0">
          <FieldLabel>Bank Code</FieldLabel>
          <Input {...register("code")} placeholder="EVEREST" />
          {touchedFields.code && errors.code ? (
            <p className="text-sm text-destructive">{errors.code.message}</p>
          ) : null}
        </Field>

        <Field className="space-y-0">
          <FieldLabel>Account Number Regex</FieldLabel>
          <Input
            {...register("accountNumberRegex")}
            placeholder="^[0-9]{10,16}$"
          />
          {touchedFields.accountNumberRegex && errors.accountNumberRegex ? (
            <p className="text-sm text-destructive">
              {errors.accountNumberRegex.message}
            </p>
          ) : null}
        </Field>

        <Field className="space-y-0">
          <FieldLabel>Min Transfer (NPR)</FieldLabel>
          <Input
            type="number"
            min={0.01}
            step="0.01"
            {...register("minTransfer")}
          />
          {touchedFields.minTransfer && errors.minTransfer ? (
            <p className="text-sm text-destructive">
              {errors.minTransfer.message}
            </p>
          ) : null}
        </Field>

        <Field className="space-y-0">
          <FieldLabel>Max Transfer (NPR)</FieldLabel>
          <Input
            type="number"
            min={0.01}
            step="0.01"
            {...register("maxTransfer")}
          />
          {touchedFields.maxTransfer && errors.maxTransfer ? (
            <p className="text-sm text-destructive">
              {errors.maxTransfer.message}
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

      <LoadingButton
        type="submit"
        loading={isSubmitting || pending}
        loadingText="Updating bank..."
        className="mt-6"
      >
        Update Bank
      </LoadingButton>
    </form>
  );
}

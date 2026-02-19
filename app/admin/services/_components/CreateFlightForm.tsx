"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { useForm, Controller } from "react-hook-form";
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
import {
  createFlightSchema,
  type CreateFlightFormInput,
  type CreateFlightFormValues,
  flightClassOptions,
  toFlightCreatePayload,
} from "../schema";
import { handleCreateFlight } from "@/lib/actions/admin/service-action";

const TEXTAREA_CLASSNAME =
  "dark:bg-input/30 border-input focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive dark:aria-invalid:border-destructive/50 disabled:bg-input/50 dark:disabled:bg-input/80 min-h-24 rounded-lg border bg-transparent px-2.5 py-2 text-sm transition-colors focus-visible:ring-[3px] aria-invalid:ring-[3px] w-full min-w-0 outline-none disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 placeholder:text-muted-foreground";

export default function CreateFlightForm() {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    setError,
    control,
    formState: { errors, isSubmitting, touchedFields },
  } = useForm<CreateFlightFormInput, unknown, CreateFlightFormValues>({
    resolver: zodResolver(createFlightSchema),
    defaultValues: {
      airline: "",
      flightNumber: "",
      from: "",
      to: "",
      departure: "",
      arrival: "",
      durationMinutes: 180,
      class: "Economy",
      price: 0,
      seatsTotal: 10,
      seatsAvailable: 10,
      metaText: "",
    },
  });

  const [pending, startTransition] = useTransition();
  const [error, setFormError] = useState<string | null>(null);

  const onSubmit = async (values: CreateFlightFormValues) => {
    setFormError(null);

    const mapped = toFlightCreatePayload(values);
    if (mapped.error || !mapped.payload) {
      setError("metaText", {
        type: "manual",
        message: mapped.error || "Invalid flight metadata",
      });
      return;
    }

    startTransition(async () => {
      const response = await handleCreateFlight(mapped.payload!);

      if (!response.success) {
        const message = response.message || "Failed to create flight";
        setFormError(message);
        toast.error(message);
        return;
      }

      toast.success("Flight created successfully");
      router.push("/admin/services?tab=flights");
      router.refresh();
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {error ? <p className="text-sm text-destructive">{error}</p> : null}

      <FieldGroup>
        <Field className="space-y-0">
          <FieldLabel>Airline</FieldLabel>
          <Input {...register("airline")} placeholder="Qatar Airways" />
          {touchedFields.airline && errors.airline ? (
            <p className="text-sm text-destructive">{errors.airline.message}</p>
          ) : null}
        </Field>

        <Field className="space-y-0">
          <FieldLabel>Flight Number</FieldLabel>
          <Input {...register("flightNumber")} placeholder="QR 652" />
          {touchedFields.flightNumber && errors.flightNumber ? (
            <p className="text-sm text-destructive">{errors.flightNumber.message}</p>
          ) : null}
        </Field>

        <Field className="space-y-0">
          <FieldLabel>From</FieldLabel>
          <Input {...register("from")} placeholder="Kathmandu" />
          {touchedFields.from && errors.from ? (
            <p className="text-sm text-destructive">{errors.from.message}</p>
          ) : null}
        </Field>

        <Field className="space-y-0">
          <FieldLabel>To</FieldLabel>
          <Input {...register("to")} placeholder="Doha" />
          {touchedFields.to && errors.to ? (
            <p className="text-sm text-destructive">{errors.to.message}</p>
          ) : null}
        </Field>

        <Field className="space-y-0">
          <FieldLabel>Departure</FieldLabel>
          <Input type="datetime-local" {...register("departure")} />
          {touchedFields.departure && errors.departure ? (
            <p className="text-sm text-destructive">
              {String(errors.departure.message)}
            </p>
          ) : null}
        </Field>

        <Field className="space-y-0">
          <FieldLabel>Arrival</FieldLabel>
          <Input type="datetime-local" {...register("arrival")} />
          {touchedFields.arrival && errors.arrival ? (
            <p className="text-sm text-destructive">{String(errors.arrival.message)}</p>
          ) : null}
        </Field>

        <Field className="space-y-0">
          <FieldLabel>Duration (Minutes)</FieldLabel>
          <Input type="number" min={1} {...register("durationMinutes")} />
          {touchedFields.durationMinutes && errors.durationMinutes ? (
            <p className="text-sm text-destructive">
              {errors.durationMinutes.message}
            </p>
          ) : null}
        </Field>

        <Field className="space-y-0">
          <FieldLabel>Class</FieldLabel>
          <Controller
            name="class"
            control={control}
            render={({ field: { value, onChange } }) => (
              <Select value={value} onValueChange={onChange}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select class" />
                </SelectTrigger>
                <SelectContent>
                  {flightClassOptions.map((option) => (
                    <SelectItem key={option} value={option}>
                      {option}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
          {touchedFields.class && errors.class ? (
            <p className="text-sm text-destructive">{errors.class.message}</p>
          ) : null}
        </Field>

        <Field className="space-y-0">
          <FieldLabel>Price (NPR)</FieldLabel>
          <Input type="number" min={0} step="0.01" {...register("price")} />
          {touchedFields.price && errors.price ? (
            <p className="text-sm text-destructive">{errors.price.message}</p>
          ) : null}
        </Field>

        <Field className="space-y-0">
          <FieldLabel>Seats Total</FieldLabel>
          <Input type="number" min={1} {...register("seatsTotal")} />
          {touchedFields.seatsTotal && errors.seatsTotal ? (
            <p className="text-sm text-destructive">{errors.seatsTotal.message}</p>
          ) : null}
        </Field>

        <Field className="space-y-0">
          <FieldLabel>Seats Available</FieldLabel>
          <Input type="number" min={0} {...register("seatsAvailable")} />
          {touchedFields.seatsAvailable && errors.seatsAvailable ? (
            <p className="text-sm text-destructive">
              {errors.seatsAvailable.message}
            </p>
          ) : null}
        </Field>
      </FieldGroup>

      <Field className="space-y-0">
        <FieldLabel>Meta JSON (Optional)</FieldLabel>
        <textarea
          {...register("metaText")}
          className={TEXTAREA_CLASSNAME}
          placeholder='{"gate": "A1", "terminal": "T2"}'
        />
        {touchedFields.metaText && errors.metaText ? (
          <p className="text-sm text-destructive">{errors.metaText.message}</p>
        ) : null}
      </Field>

      <LoadingButton
        type="submit"
        loading={isSubmitting || pending}
        loadingText="Creating flight..."
        className="mt-6"
      >
        Create Flight
      </LoadingButton>
    </form>
  );
}

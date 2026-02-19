"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "react-toastify";
import { Input } from "@/components/ui/input";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { LoadingButton } from "@/app/_components/LoadingButton";
import {
  createHotelSchema,
  type CreateHotelFormInput,
  type CreateHotelFormValues,
  toHotelCreatePayload,
} from "../schema";
import { handleCreateHotel } from "@/lib/actions/admin/service-action";

const TEXTAREA_CLASSNAME =
  "dark:bg-input/30 border-input focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive dark:aria-invalid:border-destructive/50 disabled:bg-input/50 dark:disabled:bg-input/80 min-h-20 rounded-lg border bg-transparent px-2.5 py-2 text-sm transition-colors focus-visible:ring-[3px] aria-invalid:ring-[3px] w-full min-w-0 outline-none disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 placeholder:text-muted-foreground";

export default function CreateHotelForm() {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, touchedFields },
  } = useForm<CreateHotelFormInput, unknown, CreateHotelFormValues>({
    resolver: zodResolver(createHotelSchema),
    defaultValues: {
      name: "",
      city: "",
      roomType: "",
      roomsTotal: 10,
      roomsAvailable: 10,
      pricePerNight: 0,
      amenitiesText: "",
      imagesText: "",
    },
  });

  const [pending, startTransition] = useTransition();
  const [error, setFormError] = useState<string | null>(null);

  const onSubmit = async (values: CreateHotelFormValues) => {
    setFormError(null);

    const payload = toHotelCreatePayload(values);

    startTransition(async () => {
      const response = await handleCreateHotel(payload);

      if (!response.success) {
        const message = response.message || "Failed to create hotel";
        setFormError(message);
        toast.error(message);
        return;
      }

      toast.success("Hotel created successfully");
      router.push("/admin/services?tab=hotels");
      router.refresh();
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {error ? <p className="text-sm text-destructive">{error}</p> : null}

      <FieldGroup>
        <Field className="space-y-0">
          <FieldLabel>Name</FieldLabel>
          <Input {...register("name")} placeholder="Himalayan Retreat" />
          {touchedFields.name && errors.name ? (
            <p className="text-sm text-destructive">{errors.name.message}</p>
          ) : null}
        </Field>

        <Field className="space-y-0">
          <FieldLabel>City</FieldLabel>
          <Input {...register("city")} placeholder="Kathmandu" />
          {touchedFields.city && errors.city ? (
            <p className="text-sm text-destructive">{errors.city.message}</p>
          ) : null}
        </Field>

        <Field className="space-y-0">
          <FieldLabel>Room Type</FieldLabel>
          <Input {...register("roomType")} placeholder="Deluxe" />
          {touchedFields.roomType && errors.roomType ? (
            <p className="text-sm text-destructive">{errors.roomType.message}</p>
          ) : null}
        </Field>

        <Field className="space-y-0">
          <FieldLabel>Rooms Total</FieldLabel>
          <Input type="number" min={1} {...register("roomsTotal")} />
          {touchedFields.roomsTotal && errors.roomsTotal ? (
            <p className="text-sm text-destructive">{errors.roomsTotal.message}</p>
          ) : null}
        </Field>

        <Field className="space-y-0">
          <FieldLabel>Rooms Available</FieldLabel>
          <Input type="number" min={0} {...register("roomsAvailable")} />
          {touchedFields.roomsAvailable && errors.roomsAvailable ? (
            <p className="text-sm text-destructive">
              {errors.roomsAvailable.message}
            </p>
          ) : null}
        </Field>

        <Field className="space-y-0">
          <FieldLabel>Price Per Night (NPR)</FieldLabel>
          <Input
            type="number"
            min={0}
            step="0.01"
            {...register("pricePerNight")}
          />
          {touchedFields.pricePerNight && errors.pricePerNight ? (
            <p className="text-sm text-destructive">
              {errors.pricePerNight.message}
            </p>
          ) : null}
        </Field>
      </FieldGroup>

      <Field className="space-y-0">
        <FieldLabel>Amenities (comma separated)</FieldLabel>
        <textarea
          {...register("amenitiesText")}
          className={TEXTAREA_CLASSNAME}
          placeholder="wifi, breakfast, parking"
        />
        {touchedFields.amenitiesText && errors.amenitiesText ? (
          <p className="text-sm text-destructive">
            {errors.amenitiesText.message}
          </p>
        ) : null}
      </Field>

      <Field className="space-y-0">
        <FieldLabel>Image URLs (comma separated)</FieldLabel>
        <textarea
          {...register("imagesText")}
          className={TEXTAREA_CLASSNAME}
          placeholder="https://example.com/1.jpg, https://example.com/2.jpg"
        />
        {touchedFields.imagesText && errors.imagesText ? (
          <p className="text-sm text-destructive">{errors.imagesText.message}</p>
        ) : null}
      </Field>

      <LoadingButton
        type="submit"
        loading={isSubmitting || pending}
        loadingText="Creating hotel..."
        className="mt-6"
      >
        Create Hotel
      </LoadingButton>
    </form>
  );
}

import z from "zod";
import type {
  CreateFlightPayload,
  CreateHotelPayload,
  FlightClass,
  UpdateFlightPayload,
  UpdateHotelPayload,
} from "@/lib/types/admin-services";

const parseDate = (value: unknown) => {
  if (value instanceof Date) {
    return value;
  }

  if (typeof value === "string" && value.trim().length > 0) {
    const parsed = new Date(value);
    if (!Number.isNaN(parsed.getTime())) {
      return parsed;
    }
  }

  return value;
};

const positiveInt = (label: string) =>
  z
    .coerce
    .number({ message: `${label} must be a number` })
    .int({ message: `${label} must be an integer` })
    .positive({ message: `${label} must be greater than 0` });

const nonNegativeNumber = (label: string) =>
  z
    .coerce
    .number({ message: `${label} must be a number` })
    .nonnegative({ message: `${label} cannot be negative` });

const nonNegativeInt = (label: string) =>
  z
    .coerce
    .number({ message: `${label} must be a number` })
    .int({ message: `${label} must be an integer` })
    .nonnegative({ message: `${label} cannot be negative` });

export const flightClassOptions: FlightClass[] = ["Economy", "Business"];

const baseFlightSchema = z.object({
  airline: z.string().trim().min(2, "Airline is required"),
  flightNumber: z.string().trim().min(2, "Flight number is required"),
  from: z.string().trim().min(2, "From is required"),
  to: z.string().trim().min(2, "To is required"),
  departure: z.preprocess(parseDate, z.date("Departure must be a valid date")),
  arrival: z.preprocess(parseDate, z.date("Arrival must be a valid date")),
  durationMinutes: positiveInt("Duration"),
  class: z.enum(["Economy", "Business"]),
  price: nonNegativeNumber("Price"),
  seatsTotal: positiveInt("Seats total"),
  seatsAvailable: nonNegativeInt("Seats available"),
  metaText: z.string().optional(),
});

export const createFlightSchema = baseFlightSchema.superRefine((value, ctx) => {
  if (value.arrival <= value.departure) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      path: ["arrival"],
      message: "Arrival must be after departure",
    });
  }

  if (value.seatsAvailable > value.seatsTotal) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      path: ["seatsAvailable"],
      message: "Seats available cannot exceed seats total",
    });
  }
});

export type CreateFlightFormInput = z.input<typeof createFlightSchema>;
export type CreateFlightFormValues = z.output<typeof createFlightSchema>;

export const editFlightSchema = createFlightSchema;
export type EditFlightFormInput = z.input<typeof editFlightSchema>;
export type EditFlightFormValues = z.output<typeof editFlightSchema>;

const baseHotelSchema = z.object({
  name: z.string().trim().min(2, "Hotel name is required"),
  city: z.string().trim().min(2, "City is required"),
  roomType: z.string().trim().min(2, "Room type is required"),
  roomsTotal: positiveInt("Rooms total"),
  roomsAvailable: nonNegativeInt("Rooms available"),
  pricePerNight: nonNegativeNumber("Price per night"),
  amenitiesText: z.string().optional(),
  imagesText: z.string().optional(),
});

export const createHotelSchema = baseHotelSchema.superRefine((value, ctx) => {
  if (value.roomsAvailable > value.roomsTotal) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      path: ["roomsAvailable"],
      message: "Rooms available cannot exceed rooms total",
    });
  }
});

export type CreateHotelFormInput = z.input<typeof createHotelSchema>;
export type CreateHotelFormValues = z.output<typeof createHotelSchema>;

export const editHotelSchema = createHotelSchema;
export type EditHotelFormInput = z.input<typeof editHotelSchema>;
export type EditHotelFormValues = z.output<typeof editHotelSchema>;

const trimToUndefined = (value?: string) => {
  const next = value?.trim();
  return next ? next : undefined;
};

export const parseCsvToArray = (value?: string) => {
  if (!value) return [];

  return value
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
};

export const safeParseMeta = (value?: string) => {
  const raw = trimToUndefined(value);
  if (!raw) {
    return {
      data: undefined as Record<string, unknown> | undefined,
    };
  }

  try {
    const parsed = JSON.parse(raw) as unknown;

    if (
      parsed === null ||
      typeof parsed !== "object" ||
      Array.isArray(parsed)
    ) {
      return {
        error: "Meta JSON must be an object",
      };
    }

    return {
      data: parsed as Record<string, unknown>,
    };
  } catch {
    return {
      error: "Meta JSON is invalid",
    };
  }
};

export const toDateTimeLocalValue = (value?: string | Date | null) => {
  if (!value) return "";

  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) return "";

  const tzOffsetMs = date.getTimezoneOffset() * 60 * 1000;
  const local = new Date(date.getTime() - tzOffsetMs);
  return local.toISOString().slice(0, 16);
};

export const toFlightCreatePayload = (
  values: CreateFlightFormValues,
): { payload?: CreateFlightPayload; error?: string } => {
  const parsedMeta = safeParseMeta(values.metaText);
  if (parsedMeta.error) {
    return { error: parsedMeta.error };
  }

  return {
    payload: {
      airline: values.airline.trim(),
      flightNumber: values.flightNumber.trim(),
      from: values.from.trim(),
      to: values.to.trim(),
      departure: values.departure.toISOString(),
      arrival: values.arrival.toISOString(),
      durationMinutes: values.durationMinutes,
      class: values.class,
      price: values.price,
      seatsTotal: values.seatsTotal,
      seatsAvailable: values.seatsAvailable,
      ...(parsedMeta.data ? { meta: parsedMeta.data } : {}),
    },
  };
};

export const toFlightUpdatePayload = (
  values: EditFlightFormValues,
): { payload?: UpdateFlightPayload; error?: string } => {
  const mapped = toFlightCreatePayload(values);
  if (!mapped.payload || mapped.error) {
    return mapped;
  }

  return {
    payload: mapped.payload,
  };
};

export const toHotelCreatePayload = (
  values: CreateHotelFormValues,
): CreateHotelPayload => {
  const amenities = parseCsvToArray(values.amenitiesText);
  const images = parseCsvToArray(values.imagesText);

  return {
    name: values.name.trim(),
    city: values.city.trim(),
    roomType: values.roomType.trim(),
    roomsTotal: values.roomsTotal,
    roomsAvailable: values.roomsAvailable,
    pricePerNight: values.pricePerNight,
    amenities,
    images,
  };
};

export const toHotelUpdatePayload = (
  values: EditHotelFormValues,
): UpdateHotelPayload => {
  return toHotelCreatePayload(values);
};

export const csvFromArray = (value?: string[]) => {
  if (!value || value.length === 0) {
    return "";
  }

  return value.join(", ");
};

export const metaJsonFromRecord = (value?: Record<string, unknown>) => {
  if (!value || Object.keys(value).length === 0) {
    return "";
  }

  return JSON.stringify(value, null, 2);
};

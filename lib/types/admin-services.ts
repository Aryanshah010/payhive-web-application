export type ServiceApiError = {
  message: string;
  status?: number;
  code?: string;
  details?: unknown;
};

export type AdminListResponse<T> = {
  items: T[];
  page: number;
  limit: number;
  total: number;
  totalPages: number;
};

export type FlightClass = "Economy" | "Business";
export type UtilityServiceType = "internet" | "topup";

export type AdminFlight = {
  _id: string;
  airline: string;
  flightNumber: string;
  from: string;
  to: string;
  departure: string;
  arrival: string;
  durationMinutes: number;
  class: FlightClass;
  price: number;
  seatsTotal: number;
  seatsAvailable: number;
  meta?: Record<string, unknown>;
  createdAt?: string;
  updatedAt?: string;
};

export type AdminHotel = {
  _id: string;
  name: string;
  city: string;
  roomType: string;
  roomsTotal: number;
  roomsAvailable: number;
  pricePerNight: number;
  amenities: string[];
  images: string[];
  createdAt?: string;
  updatedAt?: string;
};

export type AdminUtilityService = {
  _id: string;
  type: UtilityServiceType;
  provider: string;
  name: string;
  packageLabel: string;
  amount: number;
  validationRegex: string;
  isActive: boolean;
  meta?: Record<string, unknown>;
  createdAt?: string;
  updatedAt?: string;
};

export type FlightListQuery = {
  page?: number;
  limit?: number;
  search?: string;
  from?: string;
  to?: string;
  date?: string;
  class?: FlightClass | "";
};

export type HotelListQuery = {
  page?: number;
  limit?: number;
  search?: string;
  city?: string;
};

export type UtilityServiceListQuery = {
  page?: number;
  limit?: number;
  provider?: string;
  search?: string;
  isActive?: boolean;
};

export type CreateFlightPayload = {
  airline: string;
  flightNumber: string;
  from: string;
  to: string;
  departure: string;
  arrival: string;
  durationMinutes: number;
  class: FlightClass;
  price: number;
  seatsTotal: number;
  seatsAvailable: number;
  meta?: Record<string, unknown>;
};

export type UpdateFlightPayload = Partial<CreateFlightPayload>;

export type CreateHotelPayload = {
  name: string;
  city: string;
  roomType: string;
  roomsTotal: number;
  roomsAvailable: number;
  pricePerNight: number;
  amenities?: string[];
  images?: string[];
};

export type UpdateHotelPayload = Partial<CreateHotelPayload>;

export type CreateUtilityServicePayload = {
  provider: string;
  name: string;
  packageLabel?: string;
  amount: number;
  validationRegex?: string;
  isActive: boolean;
  meta?: Record<string, unknown>;
};

export type UpdateUtilityServicePayload = Partial<CreateUtilityServicePayload>;

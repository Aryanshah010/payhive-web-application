import axios from "../axios";
import { API } from "../endpoints";
import type {
  AdminFlight,
  AdminHotel,
  AdminListResponse,
  CreateFlightPayload,
  CreateHotelPayload,
  FlightListQuery,
  HotelListQuery,
  ServiceApiError,
  UpdateFlightPayload,
  UpdateHotelPayload,
} from "@/lib/types/admin-services";

type ApiResponse<T> = {
  success: boolean;
  message?: string;
  data: T;
};

type DeleteResponse = {
  success: boolean;
  message?: string;
};

const normalizeError = (error: unknown, fallback: string): ServiceApiError => {
  const err = error as {
    message?: string;
    response?: {
      status?: number;
      data?: {
        message?: string;
        code?: string;
        data?: unknown;
      };
    };
  };

  return {
    message: err.response?.data?.message || err.message || fallback,
    status: err.response?.status,
    code: err.response?.data?.code,
    details: err.response?.data?.data,
  };
};

export const createFlight = async (
  payload: CreateFlightPayload,
): Promise<ApiResponse<AdminFlight>> => {
  try {
    const response = await axios.post<ApiResponse<AdminFlight>>(
      API.ADMIN.FLIGHT.CREATE,
      payload,
    );
    return response.data;
  } catch (error) {
    throw normalizeError(error, "Create flight failed");
  }
};

export const getAllFlights = async (
  query: FlightListQuery = {},
): Promise<ApiResponse<AdminListResponse<AdminFlight>>> => {
  try {
    const response = await axios.get<ApiResponse<AdminListResponse<AdminFlight>>>(
      API.ADMIN.FLIGHT.READALL,
      { params: query },
    );
    return response.data;
  } catch (error) {
    throw normalizeError(error, "Get all flights failed");
  }
};

export const getOneFlight = async (
  id: string,
): Promise<ApiResponse<AdminFlight>> => {
  try {
    const endpoint = API.ADMIN.FLIGHT.READONE.replace(":id", id);
    const response = await axios.get<ApiResponse<AdminFlight>>(endpoint);
    return response.data;
  } catch (error) {
    throw normalizeError(error, "Get flight failed");
  }
};

export const updateOneFlight = async (
  id: string,
  payload: UpdateFlightPayload,
): Promise<ApiResponse<AdminFlight>> => {
  try {
    const endpoint = API.ADMIN.FLIGHT.UPDATE.replace(":id", id);
    const response = await axios.put<ApiResponse<AdminFlight>>(endpoint, payload);
    return response.data;
  } catch (error) {
    throw normalizeError(error, "Update flight failed");
  }
};

export const deleteOneFlight = async (id: string): Promise<DeleteResponse> => {
  try {
    const endpoint = API.ADMIN.FLIGHT.DELETE.replace(":id", id);
    const response = await axios.delete(endpoint);

    if (response.status === 204) {
      return {
        success: true,
        message: "Flight deleted successfully",
      };
    }

    return response.data as DeleteResponse;
  } catch (error) {
    throw normalizeError(error, "Delete flight failed");
  }
};

export const createHotel = async (
  payload: CreateHotelPayload,
): Promise<ApiResponse<AdminHotel>> => {
  try {
    const response = await axios.post<ApiResponse<AdminHotel>>(
      API.ADMIN.HOTEL.CREATE,
      payload,
    );
    return response.data;
  } catch (error) {
    throw normalizeError(error, "Create hotel failed");
  }
};

export const getAllHotels = async (
  query: HotelListQuery = {},
): Promise<ApiResponse<AdminListResponse<AdminHotel>>> => {
  try {
    const response = await axios.get<ApiResponse<AdminListResponse<AdminHotel>>>(
      API.ADMIN.HOTEL.READALL,
      { params: query },
    );
    return response.data;
  } catch (error) {
    throw normalizeError(error, "Get all hotels failed");
  }
};

export const getOneHotel = async (
  id: string,
): Promise<ApiResponse<AdminHotel>> => {
  try {
    const endpoint = API.ADMIN.HOTEL.READONE.replace(":id", id);
    const response = await axios.get<ApiResponse<AdminHotel>>(endpoint);
    return response.data;
  } catch (error) {
    throw normalizeError(error, "Get hotel failed");
  }
};

export const updateOneHotel = async (
  id: string,
  payload: UpdateHotelPayload,
): Promise<ApiResponse<AdminHotel>> => {
  try {
    const endpoint = API.ADMIN.HOTEL.UPDATE.replace(":id", id);
    const response = await axios.put<ApiResponse<AdminHotel>>(endpoint, payload);
    return response.data;
  } catch (error) {
    throw normalizeError(error, "Update hotel failed");
  }
};

export const deleteOneHotel = async (id: string): Promise<DeleteResponse> => {
  try {
    const endpoint = API.ADMIN.HOTEL.DELETE.replace(":id", id);
    const response = await axios.delete(endpoint);

    if (response.status === 204) {
      return {
        success: true,
        message: "Hotel deleted successfully",
      };
    }

    return response.data as DeleteResponse;
  } catch (error) {
    throw normalizeError(error, "Delete hotel failed");
  }
};

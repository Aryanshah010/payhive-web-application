import axios from "../axios";
import { API } from "../endpoints";
import type {
  AdminFlight,
  AdminHotel,
  AdminListResponse,
  AdminUtilityService,
  CreateFlightPayload,
  CreateHotelPayload,
  CreateUtilityServicePayload,
  FlightListQuery,
  HotelListQuery,
  ServiceApiError,
  UtilityServiceListQuery,
  UpdateFlightPayload,
  UpdateHotelPayload,
  UpdateUtilityServicePayload,
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

export const createInternetService = async (
  payload: CreateUtilityServicePayload,
): Promise<ApiResponse<AdminUtilityService>> => {
  try {
    const response = await axios.post<ApiResponse<AdminUtilityService>>(
      API.ADMIN.INTERNET_SERVICE.CREATE,
      payload,
    );
    return response.data;
  } catch (error) {
    throw normalizeError(error, "Create internet service failed");
  }
};

export const getAllInternetServices = async (
  query: UtilityServiceListQuery = {},
): Promise<ApiResponse<AdminListResponse<AdminUtilityService>>> => {
  try {
    const response = await axios.get<
      ApiResponse<AdminListResponse<AdminUtilityService>>
    >(API.ADMIN.INTERNET_SERVICE.READALL, { params: query });
    return response.data;
  } catch (error) {
    throw normalizeError(error, "Get all internet services failed");
  }
};

export const getOneInternetService = async (
  id: string,
): Promise<ApiResponse<AdminUtilityService>> => {
  try {
    const endpoint = API.ADMIN.INTERNET_SERVICE.READONE.replace(":id", id);
    const response = await axios.get<ApiResponse<AdminUtilityService>>(endpoint);
    return response.data;
  } catch (error) {
    throw normalizeError(error, "Get internet service failed");
  }
};

export const updateOneInternetService = async (
  id: string,
  payload: UpdateUtilityServicePayload,
): Promise<ApiResponse<AdminUtilityService>> => {
  try {
    const endpoint = API.ADMIN.INTERNET_SERVICE.UPDATE.replace(":id", id);
    const response = await axios.put<ApiResponse<AdminUtilityService>>(
      endpoint,
      payload,
    );
    return response.data;
  } catch (error) {
    throw normalizeError(error, "Update internet service failed");
  }
};

export const deleteOneInternetService = async (
  id: string,
): Promise<DeleteResponse> => {
  try {
    const endpoint = API.ADMIN.INTERNET_SERVICE.DELETE.replace(":id", id);
    const response = await axios.delete(endpoint);

    if (response.status === 204) {
      return {
        success: true,
        message: "Internet service deleted successfully",
      };
    }

    return response.data as DeleteResponse;
  } catch (error) {
    throw normalizeError(error, "Delete internet service failed");
  }
};

export const createTopupService = async (
  payload: CreateUtilityServicePayload,
): Promise<ApiResponse<AdminUtilityService>> => {
  try {
    const response = await axios.post<ApiResponse<AdminUtilityService>>(
      API.ADMIN.TOPUP_SERVICE.CREATE,
      payload,
    );
    return response.data;
  } catch (error) {
    throw normalizeError(error, "Create topup service failed");
  }
};

export const getAllTopupServices = async (
  query: UtilityServiceListQuery = {},
): Promise<ApiResponse<AdminListResponse<AdminUtilityService>>> => {
  try {
    const response = await axios.get<
      ApiResponse<AdminListResponse<AdminUtilityService>>
    >(API.ADMIN.TOPUP_SERVICE.READALL, { params: query });
    return response.data;
  } catch (error) {
    throw normalizeError(error, "Get all topup services failed");
  }
};

export const getOneTopupService = async (
  id: string,
): Promise<ApiResponse<AdminUtilityService>> => {
  try {
    const endpoint = API.ADMIN.TOPUP_SERVICE.READONE.replace(":id", id);
    const response = await axios.get<ApiResponse<AdminUtilityService>>(endpoint);
    return response.data;
  } catch (error) {
    throw normalizeError(error, "Get topup service failed");
  }
};

export const updateOneTopupService = async (
  id: string,
  payload: UpdateUtilityServicePayload,
): Promise<ApiResponse<AdminUtilityService>> => {
  try {
    const endpoint = API.ADMIN.TOPUP_SERVICE.UPDATE.replace(":id", id);
    const response = await axios.put<ApiResponse<AdminUtilityService>>(
      endpoint,
      payload,
    );
    return response.data;
  } catch (error) {
    throw normalizeError(error, "Update topup service failed");
  }
};

export const deleteOneTopupService = async (
  id: string,
): Promise<DeleteResponse> => {
  try {
    const endpoint = API.ADMIN.TOPUP_SERVICE.DELETE.replace(":id", id);
    const response = await axios.delete(endpoint);

    if (response.status === 204) {
      return {
        success: true,
        message: "Topup service deleted successfully",
      };
    }

    return response.data as DeleteResponse;
  } catch (error) {
    throw normalizeError(error, "Delete topup service failed");
  }
};

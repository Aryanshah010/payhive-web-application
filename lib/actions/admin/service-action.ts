"use server";

import { revalidatePath } from "next/cache";
import {
  createFlight,
  createHotel,
  createInternetService,
  createTopupService,
  deleteOneFlight,
  deleteOneHotel,
  deleteOneInternetService,
  deleteOneTopupService,
  getAllFlights,
  getAllHotels,
  getAllInternetServices,
  getAllTopupServices,
  getOneFlight,
  getOneHotel,
  getOneInternetService,
  getOneTopupService,
  updateOneFlight,
  updateOneHotel,
  updateOneInternetService,
  updateOneTopupService,
} from "@/lib/api/admin/service";
import type {
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

const SERVICE_REVALIDATE_PATHS = [
  "/admin/services",
  "/admin/services/flights",
  "/admin/services/hotels",
  "/admin/services/internet",
  "/admin/services/topup",
] as const;

const revalidateServicePaths = () => {
  SERVICE_REVALIDATE_PATHS.forEach((path) => revalidatePath(path));
};

const normalizeActionError = (error: unknown, fallback: string) => {
  const err = error as ServiceApiError;
  return {
    success: false as const,
    message: err.message || fallback,
    status: err.status,
    code: err.code,
    details: err.details,
  };
};

export const handleCreateFlight = async (payload: CreateFlightPayload) => {
  try {
    const response = await createFlight(payload);

    if (response.success) {
      revalidateServicePaths();
      return {
        success: true,
        message: response.message || "Flight created successfully",
        data: response.data,
      };
    }

    return {
      success: false,
      message: response.message || "Create flight failed",
    };
  } catch (error) {
    return normalizeActionError(error, "Create flight action failed");
  }
};

export const handleGetAllFlights = async (query: FlightListQuery = {}) => {
  try {
    const response = await getAllFlights(query);

    if (response.success) {
      return {
        success: true,
        message: response.message || "Flights fetched successfully",
        data: response.data,
      };
    }

    return {
      success: false,
      message: response.message || "Get all flights failed",
    };
  } catch (error) {
    return normalizeActionError(error, "Get all flights action failed");
  }
};

export const handleGetOneFlight = async (id: string) => {
  try {
    const response = await getOneFlight(id);

    if (response.success) {
      return {
        success: true,
        message: response.message || "Flight fetched successfully",
        data: response.data,
      };
    }

    return {
      success: false,
      message: response.message || "Get flight failed",
    };
  } catch (error) {
    return normalizeActionError(error, "Get flight action failed");
  }
};

export const handleUpdateOneFlight = async (
  id: string,
  payload: UpdateFlightPayload,
) => {
  try {
    const response = await updateOneFlight(id, payload);

    if (response.success) {
      revalidateServicePaths();
      revalidatePath(`/admin/services/flights/${id}`);
      return {
        success: true,
        message: response.message || "Flight updated successfully",
        data: response.data,
      };
    }

    return {
      success: false,
      message: response.message || "Update flight failed",
    };
  } catch (error) {
    return normalizeActionError(error, "Update flight action failed");
  }
};

export const handleDeleteOneFlight = async (id: string) => {
  try {
    const response = await deleteOneFlight(id);

    if (response.success) {
      revalidateServicePaths();
      return {
        success: true,
        message: response.message || "Flight deleted successfully",
      };
    }

    return {
      success: false,
      message: response.message || "Delete flight failed",
    };
  } catch (error) {
    return normalizeActionError(error, "Delete flight action failed");
  }
};

export const handleCreateHotel = async (payload: CreateHotelPayload) => {
  try {
    const response = await createHotel(payload);

    if (response.success) {
      revalidateServicePaths();
      return {
        success: true,
        message: response.message || "Hotel created successfully",
        data: response.data,
      };
    }

    return {
      success: false,
      message: response.message || "Create hotel failed",
    };
  } catch (error) {
    return normalizeActionError(error, "Create hotel action failed");
  }
};

export const handleGetAllHotels = async (query: HotelListQuery = {}) => {
  try {
    const response = await getAllHotels(query);

    if (response.success) {
      return {
        success: true,
        message: response.message || "Hotels fetched successfully",
        data: response.data,
      };
    }

    return {
      success: false,
      message: response.message || "Get all hotels failed",
    };
  } catch (error) {
    return normalizeActionError(error, "Get all hotels action failed");
  }
};

export const handleGetOneHotel = async (id: string) => {
  try {
    const response = await getOneHotel(id);

    if (response.success) {
      return {
        success: true,
        message: response.message || "Hotel fetched successfully",
        data: response.data,
      };
    }

    return {
      success: false,
      message: response.message || "Get hotel failed",
    };
  } catch (error) {
    return normalizeActionError(error, "Get hotel action failed");
  }
};

export const handleUpdateOneHotel = async (
  id: string,
  payload: UpdateHotelPayload,
) => {
  try {
    const response = await updateOneHotel(id, payload);

    if (response.success) {
      revalidateServicePaths();
      revalidatePath(`/admin/services/hotels/${id}`);
      return {
        success: true,
        message: response.message || "Hotel updated successfully",
        data: response.data,
      };
    }

    return {
      success: false,
      message: response.message || "Update hotel failed",
    };
  } catch (error) {
    return normalizeActionError(error, "Update hotel action failed");
  }
};

export const handleDeleteOneHotel = async (id: string) => {
  try {
    const response = await deleteOneHotel(id);

    if (response.success) {
      revalidateServicePaths();
      return {
        success: true,
        message: response.message || "Hotel deleted successfully",
      };
    }

    return {
      success: false,
      message: response.message || "Delete hotel failed",
    };
  } catch (error) {
    return normalizeActionError(error, "Delete hotel action failed");
  }
};

export const handleCreateInternetService = async (
  payload: CreateUtilityServicePayload,
) => {
  try {
    const response = await createInternetService(payload);

    if (response.success) {
      revalidateServicePaths();
      return {
        success: true,
        message: response.message || "Internet service created successfully",
        data: response.data,
      };
    }

    return {
      success: false,
      message: response.message || "Create internet service failed",
    };
  } catch (error) {
    return normalizeActionError(error, "Create internet service action failed");
  }
};

export const handleGetAllInternetServices = async (
  query: UtilityServiceListQuery = {},
) => {
  try {
    const response = await getAllInternetServices(query);

    if (response.success) {
      return {
        success: true,
        message: response.message || "Internet services fetched successfully",
        data: response.data,
      };
    }

    return {
      success: false,
      message: response.message || "Get all internet services failed",
    };
  } catch (error) {
    return normalizeActionError(
      error,
      "Get all internet services action failed",
    );
  }
};

export const handleGetOneInternetService = async (id: string) => {
  try {
    const response = await getOneInternetService(id);

    if (response.success) {
      return {
        success: true,
        message: response.message || "Internet service fetched successfully",
        data: response.data,
      };
    }

    return {
      success: false,
      message: response.message || "Get internet service failed",
    };
  } catch (error) {
    return normalizeActionError(error, "Get internet service action failed");
  }
};

export const handleUpdateOneInternetService = async (
  id: string,
  payload: UpdateUtilityServicePayload,
) => {
  try {
    const response = await updateOneInternetService(id, payload);

    if (response.success) {
      revalidateServicePaths();
      revalidatePath(`/admin/services/internet/${id}`);
      return {
        success: true,
        message: response.message || "Internet service updated successfully",
        data: response.data,
      };
    }

    return {
      success: false,
      message: response.message || "Update internet service failed",
    };
  } catch (error) {
    return normalizeActionError(error, "Update internet service action failed");
  }
};

export const handleDeleteOneInternetService = async (id: string) => {
  try {
    const response = await deleteOneInternetService(id);

    if (response.success) {
      revalidateServicePaths();
      return {
        success: true,
        message: response.message || "Internet service deleted successfully",
      };
    }

    return {
      success: false,
      message: response.message || "Delete internet service failed",
    };
  } catch (error) {
    return normalizeActionError(error, "Delete internet service action failed");
  }
};

export const handleCreateTopupService = async (
  payload: CreateUtilityServicePayload,
) => {
  try {
    const response = await createTopupService(payload);

    if (response.success) {
      revalidateServicePaths();
      return {
        success: true,
        message: response.message || "Topup service created successfully",
        data: response.data,
      };
    }

    return {
      success: false,
      message: response.message || "Create topup service failed",
    };
  } catch (error) {
    return normalizeActionError(error, "Create topup service action failed");
  }
};

export const handleGetAllTopupServices = async (
  query: UtilityServiceListQuery = {},
) => {
  try {
    const response = await getAllTopupServices(query);

    if (response.success) {
      return {
        success: true,
        message: response.message || "Topup services fetched successfully",
        data: response.data,
      };
    }

    return {
      success: false,
      message: response.message || "Get all topup services failed",
    };
  } catch (error) {
    return normalizeActionError(error, "Get all topup services action failed");
  }
};

export const handleGetOneTopupService = async (id: string) => {
  try {
    const response = await getOneTopupService(id);

    if (response.success) {
      return {
        success: true,
        message: response.message || "Topup service fetched successfully",
        data: response.data,
      };
    }

    return {
      success: false,
      message: response.message || "Get topup service failed",
    };
  } catch (error) {
    return normalizeActionError(error, "Get topup service action failed");
  }
};

export const handleUpdateOneTopupService = async (
  id: string,
  payload: UpdateUtilityServicePayload,
) => {
  try {
    const response = await updateOneTopupService(id, payload);

    if (response.success) {
      revalidateServicePaths();
      revalidatePath(`/admin/services/topup/${id}`);
      return {
        success: true,
        message: response.message || "Topup service updated successfully",
        data: response.data,
      };
    }

    return {
      success: false,
      message: response.message || "Update topup service failed",
    };
  } catch (error) {
    return normalizeActionError(error, "Update topup service action failed");
  }
};

export const handleDeleteOneTopupService = async (id: string) => {
  try {
    const response = await deleteOneTopupService(id);

    if (response.success) {
      revalidateServicePaths();
      return {
        success: true,
        message: response.message || "Topup service deleted successfully",
      };
    }

    return {
      success: false,
      message: response.message || "Delete topup service failed",
    };
  } catch (error) {
    return normalizeActionError(error, "Delete topup service action failed");
  }
};

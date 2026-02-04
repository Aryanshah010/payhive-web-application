/* eslint-disable @typescript-eslint/no-explicit-any */
import { API } from "./endpoints";
import axios from "./axios";

export const updateProfile = async (profileData: any) => {
  try {
    const response = await axios.put(
      API.USER.UPDATEPROFILE,
      profileData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        }
      }
    );
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || error.message || 'Update profile failed');
  }
};

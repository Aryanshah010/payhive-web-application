/* eslint-disable @typescript-eslint/no-explicit-any */
import { API } from "../endpoints";
import axios from "../axios";


export const createUser = async (userData: any) => {
    try {
        const response = await axios.post(
            API.ADMIN.USER.CREATE,
            userData,
            {
                headers: {
                    'Content-Type': 'multipart/form-data', // for file upload/multer
                }
            }
        );
        return response.data;
    } catch (error: Error | any) {
        throw new Error(error.response?.data?.message
            || error.message || 'Create user failed');
    }
}

export const updateOneUser = async (id: string, userData: any) => {
    try {
        const endpoint = API.ADMIN.USER.UPDATE.replace(':id', id);
        const response = await axios.put(
            endpoint,
            userData,
            {
                headers: {
                    'Content-Type': 'multipart/form-data',
                }
            }
        );
        return response.data;
    } catch (error: Error | any) {
        throw new Error(error.response?.data?.message
            || error.message || 'Update user failed');
    }
}


export const getAllUsers = async () => {
    try {
        const response = await axios.get(API.ADMIN.USER.READALL);
        return response.data;
    } catch (error: Error | any) {
        throw new Error(error.response?.data?.message
            || error.message || 'Get all users failed');
    }
}

export const getOneUser = async (id: string) => {
    try {
        const endpoint = API.ADMIN.USER.READONE.replace(':id', id);
        const response = await axios.get(endpoint);
        return response.data;
    } catch (error: Error | any) {
        throw new Error(error.response?.data?.message
            || error.message || 'Get user failed');
    }
}

export const deleteOneUser = async (id: string) => {
    try {
        const endpoint = API.ADMIN.USER.DELETE.replace(':id', id);
        const response = await axios.delete(endpoint);
        return response.data;
    } catch (error: Error | any) {
        throw new Error(error.response?.data?.message
            || error.message || 'Delete user failed');
    }
}
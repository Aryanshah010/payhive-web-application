/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from "./axios";
import { API } from './endpoints';
import {
    ForgotPasswordType,
    LoginType,
    RegisterType,
    ResetPasswordType
} from "@/app/(auth)/Schema";


export const register = async (registerData: RegisterType) => {
    try {
        const response = await axios.post(API.AUTH.REGISTER, registerData)
        return response.data
    } catch (error: Error | any) {
        throw new Error(error.response?.data?.message || error.message || 'Registration failed')
    }
}

export const login = async (loginData: LoginType) => {
    try {
        const response = await axios.post(API.AUTH.LOGIN, loginData)
        return response.data
    } catch (error: Error | any) {
        throw new Error(error.response?.data?.message || error.message || 'Login failed')
    }
}

export const fetchUserData = async () => {
    try {
        const response = await axios.get(API.AUTH.ME);
        return response.data;
    } catch (error: Error | any) {
        throw new Error(error.response?.data?.message || error.message || 'Fetch user data failed');
    }
}

export const requestPasswordReset = async (data: ForgotPasswordType) => {
    try {
        const response = await axios.post(API.AUTH.REQUEST_PASSWORD_RESET, data);
        return response.data;
    } catch (error: Error | any) {
        throw new Error(error.response?.data?.message || error.message || 'Request password reset failed');
    }
}

export const resetPassword = async (token: string, data: Pick<ResetPasswordType, "newPassword">) => {
    try {
        const response = await axios.post(`${API.AUTH.RESET_PASSWORD}/${token}`, data);
        return response.data;
    } catch (error: Error | any) {
        throw new Error(error.response?.data?.message || error.message || 'Reset password failed');
    }
}

/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import { cookies } from "next/headers";

export const setAuthToken = async (token: string) => {
    const cookieStore = await cookies();
    cookieStore.set({ name: 'auth_token', value: token });
}

export const getAuthToken = async () => {
    const cookieStore = await cookies();
    return cookieStore.get('auth_token')?.value;
}

export const setUserData = async (userData: any) => {
    const cookieStore = await cookies();
    //cookie can only store string values
    //so we need to stringify the user data
    cookieStore.set({
        name: 'user_data',
        value: JSON.stringify(userData)
    });
}

export const getUserData = async () => {
    const cookieStore = await cookies();
    const userData = cookieStore.get('user_data')?.value;
    return userData ? JSON.parse(userData) : null;
}

export const clearAuthCookies = async () => {
    const cookieStore = await cookies();
    cookieStore.delete('auth_token');
    cookieStore.delete('user_data');
}
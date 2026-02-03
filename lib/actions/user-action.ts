/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";
import { setUserData } from '@/lib/cookie';
import { revalidatePath } from 'next/cache';
import { updateProfile } from "../api/user";
import { fetchUserData } from '../api/auth';


export async function handleUpdateProfile(profileData: FormData) {
    try {
        const result = await updateProfile(profileData);
        if (result.success) {
            await setUserData(result.data);
            revalidatePath('/user/profile');
            return {
                success: true,
                message: 'Profile updated successfully',
                data: result.data
            };
        }
        return { success: false, message: result.message || 'Failed to update profile' };
    } catch (error: Error | any) {
        return { success: false, message: error.message };
    }
}

export async function handleWhoAmI() {
    try {
        const result = await fetchUserData();
        if (result.success) {
            return {
                success: true,
                message: 'User data fetched successfully',
                data: result.data
            };
        }
        return { success: false, message: result.message || 'Failed to fetch user data' };
    } catch (error: Error | any) {
        return { success: false, message: error.message };
    }
}
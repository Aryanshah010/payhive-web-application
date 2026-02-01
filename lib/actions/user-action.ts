/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";
import { setUserData } from '@/lib/cookie';
import { revalidatePath } from 'next/cache';
import { updateProfile } from "../api/user";


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
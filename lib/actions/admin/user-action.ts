/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";
import { createUser, deleteOneUser, getAllUsers, getOneUser, updateOneUser } from "@/lib/api/admin/user";
import { revalidatePath } from 'next/cache';

export const handleCreateUser = async (data: FormData) => {
    try {
        const response = await createUser(data)
        if (response.success) {
            revalidatePath('/admin/users');
            return {
                success: true,
                message: 'Registration successful',
                data: response.data
            }
        }
        return {
            success: false,
            message: response.message || 'Registration failed'
        }
    } catch (error: Error | any) {
        return { success: false, message: error.message || 'Registration action failed' }
    }
}

export const handleGetAllUsers = async () => {
    try {
        const response = await getAllUsers();
        if (response.success) {
            return {
                success: true,
                data: response.data
            }
        }
        return {
            success: false,
            message: response.message || 'Get all users failed'
        }
    } catch (error: Error | any) {
        return { success: false, message: error.message || 'Get all users action failed' }
    }
}

export const handleGetOneUser = async (id: string) => {
    try {
        const response = await getOneUser(id);
        if (response.success) {
            return {
                success: true,
                data: response.data
            }
        }
        return {
            success: false,
            message: response.message || 'Get user failed'
        }
    } catch (error: Error | any) {
        return { success: false, message: error.message || 'Get user action failed' }
    }
}

export const handleUpdateOneUser = async (id: string, data: FormData) => {
    try {
        const response = await updateOneUser(id, data)
        if (response.success) {
            revalidatePath('/admin/users');
            return {
                success: true,
                message: 'Update successful',
                data: response.data
            }
        }
        return {
            success: false,
            message: response.message || 'Update failed'
        }
    } catch (error: Error | any) {
        return { success: false, message: error.message || 'Update action failed' }
    }
}

export const handleDeleteOneUser = async (id: string) => {
    try {
        const response = await deleteOneUser(id);
        if (response.success) {
            revalidatePath('/admin/users');
            return {
                success: true,
                message: 'User Deleted successfully'
            }
        }
        return {
            success: false,
            message: response.message || 'Delete failed'
        }
    } catch (error: Error | any) {
        return { success: false, message: error.message || 'Delete action failed' }
    }
}


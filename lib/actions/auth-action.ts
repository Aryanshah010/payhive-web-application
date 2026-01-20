/* eslint-disable @typescript-eslint/no-explicit-any */
//Server side acitons
"use server";
import { login, register } from "../api/auth";
import { setAuthToken, setUserData, clearAuthCookies } from "../cookie";
import { redirect } from "next/navigation";

export async function handleRegister(formData: any) {
    try {
        //how to take data from component
        const result = await register(formData);

        //how to send data to component
        if (result.success) {
            return {
                success: true,
                message: "Registration Successfull",
                data: result.data
            }

        }
        return {
            success: false, message: result.message || "Register Failed"
        }
    } catch (err: Error | any) {
        return { success: false, message: err.message }
    }


}
export async function handleLogin(formData: any) {
    try {
        //how to take data from component
        const result = await login(formData);

        //how to send data to component
        if (result.success) {
            await setAuthToken(result.token);
            await setUserData(result.data);
            return {
                success: true,
                message: "Login Successfull",
                data: result.data
            }

        }
        return {
            success: false, message: result.message || "Login Failed"
        }
    } catch (err: Error | any) {
        return { success: false, message: err.message }
    }


}

export const handleLogout = async () => {
    await clearAuthCookies();
    return redirect('/login');
}
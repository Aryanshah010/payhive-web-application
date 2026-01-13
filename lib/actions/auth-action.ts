/* eslint-disable @typescript-eslint/no-explicit-any */
//Server side acitons
"use server";
import { register } from "../api/auth";

export async function handleRegister(formData: any) {
    try {
        //how to take data from component
        const result = await register(formData);

        //how to send data to componentƒ
        if (result.success) {
            return {
                success: true,
                message: "Registration Successful",
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
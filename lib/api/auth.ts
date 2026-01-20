/* eslint-disable @typescript-eslint/no-explicit-any */
//AUTHENTICAITON API CALL
import axios from "./axios"; //important
import { API } from './endpoints';

//registrationData: any -> can be RegistrationType from schema
export const register = async (registrationData: any) => {
    try {
        const response = await axios.post(API.AUTH.REGISTER, registrationData);
        return response.data; //response body
    } catch (err: Error | any) {
        //4xx - 5xx falls in catch
        throw new Error(err.response?.data?.message /*message from backend*/ || err.message /*general exception messafe*/ || "Registration failed" /*fallback message*/);
    }
}

export const login = async (loginData: any) => {
    try {
        const response = await axios.post(API.AUTH.LOGIN, loginData);
        return response.data; //response body
    } catch (err: Error | any) {
        //4xx - 5xx falls in catch
        throw new Error(err.response?.data?.message /*message from backend*/ || err.message /*general exception messafe*/ || "Login Failed" /*fallback message*/);
    }
}
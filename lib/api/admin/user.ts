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
                    'Content-Type': 'multipart/form-data',
                }
            }
        );
        return response.data;
    } catch (error: Error | any) {
        throw new Error(error.response?.data?.message
            || error.message || 'Create user failed');
    }
}

//update one user




//getAllUsers







//get/view one user




//delete one user
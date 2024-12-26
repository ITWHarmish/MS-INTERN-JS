import axios from "axios";
import { API_END_POINT } from "../utils/constants";
import { Login } from "../types/ILogin";



export const LoginApi = async (userData: Login) => {
    try {
        const res = await axios.post(`${API_END_POINT}/auth/signin`, userData, {
            withCredentials: true,
        })
        return res.data
    } catch (error) {
        console.error('Error While Login:', error);
        throw error;
    }
}

export const Verify = async () => {
    try {
        const res = await axios.get(`${API_END_POINT}/auth/verify`, {
            withCredentials: true,
        })
        return res.data
    } catch (error) {
        console.error('Error While Verifying:', error);
        throw error;
    }
}

export const GetCurrentUser = async () => {
    try {
        const res = await axios.get(`${API_END_POINT}/auth/getCurrentUser`, {
            withCredentials: true,
        })
        return res.data
    } catch (error) {
        console.error('Error While Verifying:', error);
        throw error;
    }
}

export const LogoutApi = async () => {
    try {
        const res = await axios.post(`${API_END_POINT}/auth/logout`, {}, {
            withCredentials: true,
        })
        return res.data
    } catch (error) {
        console.error('Error While Logout:', error);
        throw error;
    }
}
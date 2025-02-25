import axios from "axios";
import { API_END_POINT } from "../utils/constants";
import { Login } from "../types/ILogin";
import { IProfileForm, IProfileUpdate } from "../types/IProfile";
import Cookies from "js-cookie";

const getAuthHeaders = () => {
    const token = Cookies.get('ms_intern_jwt');
    return {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json",
    };
};

export const LoginApi = async (userData: Login) => {
    try {
        const res = await axios.post(`${API_END_POINT}/auth/signin`, userData, {
            headers: getAuthHeaders(),
        })
        return res.data
    } catch (error) {
        console.error('Error While Login:', error)
        throw error;
    }
}

export const GetCurrentUser = async () => {
    try {
        const res = await axios.get(`${API_END_POINT}/auth/getCurrentUser`, {
            headers: getAuthHeaders(),
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
            headers: getAuthHeaders(),
        })
        return res.data
    } catch (error) {
        console.error('Error While Logout:', error);
        throw error;
    }
}

export const UpdateUserDetails = async (userData: IProfileForm) => {
    try {
        const res = await axios.put(`${API_END_POINT}/auth/updateUser`, userData, {
            headers: getAuthHeaders(),
        })
        return res.data
    } catch (error) {
        console.error('Error While Verifying:', error);
        throw error;
    }
}

export const UpdateAllUserDetails = async (userData: IProfileUpdate) => {
    try {
        const res = await axios.put(`${API_END_POINT}/auth/updateAllUsersDetails`, userData, {
            headers: getAuthHeaders(),
        })
        return res.data
    } catch (error) {
        console.error('Error While Verifying:', error);
        throw error;
    }
}
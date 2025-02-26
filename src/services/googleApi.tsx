import axios from "axios";
import { API_END_POINT } from "../utils/constants";
import Cookies from "js-cookie";

const getAuthHeaders = () => {
    const token = Cookies.get('ms_intern_jwt');
    return {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json",
    };
};


export const GetRefreshTokenAndUpdateAccessToken = async (userId) => {
    try {
        const response = await axios.put(`${API_END_POINT}/refresh-token`, { userId }, {
            headers: getAuthHeaders(),
        });
        return response.data;
    } catch (error) {
        console.error("Error While Updating the token:", error);
        throw error;
    }
}

export const GoogleLogin = async () => {
    try {
        const response = await axios.get(`${API_END_POINT}/G_login`, {
            headers: getAuthHeaders(),
        });
        return response.data;
    } catch (error) {
        console.error("Error sending todos to chat:", error);
        throw error;
    }
}
import axios from "axios";
import { API_END_POINT } from "../utils/constants";

export const GetRefreshTokenAndUpdateAccessToken = async (userId) => {
    try {
        const response = await axios.put(`${API_END_POINT}/refresh-token`, { userId }, { withCredentials: true });
        return response.data;
    } catch (error) {
        console.error("Error While Updating the token:", error);
        throw error;
    }
}

export const GoogleLogin = async () => {
    try {
        const response = await axios.get(`${API_END_POINT}/G_login`, { withCredentials: true });
        return response.data;
    } catch (error) {
        console.error("Error sending todos to chat:", error);
        throw error;
    }
}
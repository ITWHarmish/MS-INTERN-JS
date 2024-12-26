import axios from "axios";
import { API_END_POINT } from "../utils/constants";


export const LoginApiTelegram = async (phone: any) => {
    const payload = { telegram: { phone } };
    try {
        const res = await axios.post(`${API_END_POINT}/login`, payload, { withCredentials: true })
        return res.data
    } catch (error) {
        console.error('Error While Login with Telegram:', error);
        throw error;
    }
}


export const SubmitApiTelegram = async (userData) => {
    const { phone, code } = userData;
    if (!phone || !code) {
        throw new Error('Phone number and code are required');
    }
    try {
        const res = await axios.post(`${API_END_POINT}/submit-otp`, userData)
        return res.data
    } catch (error) {
        console.error('Error While Login with Telegram:', error);
        throw error;
    }
}

export const LogoutApiTelegram = async (phone: any) => {
    try {
        const res = await axios.post(`${API_END_POINT}/logout`, { phone })
        return res.data
    } catch (error) {
        console.error('Error during Telegram logout:', error.response?.data || error.message);
        throw error;
    }
}


export const GetTelegram = async () => {
    try {
        const res = await axios.get(`${API_END_POINT}/getTelegram`, { withCredentials: true });
        return res.data;
    } catch (error) {
        console.error('Error fetching time logs:', error);
        throw error;
    }
}

export const SendTodosToChat = async (userData) => {
    try {
        const response = await axios.post(`${API_END_POINT}/sendTask`, userData);
        return response.data;
    } catch (error) {
        console.error("Error sending todos to chat:", error);
        throw error;
    }
}
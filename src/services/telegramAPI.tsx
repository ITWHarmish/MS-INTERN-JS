import axios from "axios";
import { API_END_POINT } from "../utils/constants";


export const LoginApiTelegram = async (phone: any) => {
    // console.log("phone:", phone)
    const payload = { telegram: { phone } };
    console.log("payload 2: " , payload);
    try {
        const res = await axios.post(`${API_END_POINT}/login`, payload)
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
    console.log("phone user: ", phone)
    try {
        const res = await axios.post(`${API_END_POINT}/logout`, { phone })
        return res.data
    } catch (error) {
        console.error('Error during Telegram logout:', error.response?.data || error.message);
        throw error;
    }
}




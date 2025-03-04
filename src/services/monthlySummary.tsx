import Cookies from "js-cookie";
import axios from "axios";
import { API_END_POINT } from "../utils/constants";
import { IMonthlySummary } from "../types/IMonthlySummary";

const getAuthHeaders = () => {
    const token = Cookies.get('ms_intern_jwt');
    return {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json",
    };
};

export const GetMonthlySummary = async (payload: IMonthlySummary) => {
    console.log("payload: ", payload);
    try {
        const response = await axios.post(`${API_END_POINT}/monthlySummary`, payload, {
            headers: getAuthHeaders(),
        }
        );
        return response.data;
    } catch (error) {
        console.error('Error while applying Leave: ', error);
        throw error;
    }
}

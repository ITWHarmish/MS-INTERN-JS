import axios from "axios";
import Cookies from "js-cookie";
import { API_END_POINT } from "../utils/constants";
import { ILeave } from "../types/ILeaves";

const getAuthHeaders = () => {
    const token = Cookies.get('ms_intern_jwt');
    return {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json",
    };
};


export const GenerateLeaveEmail = async (payload: ILeave) => {
    try {
        const response = await axios.post(`${API_END_POINT}/leaveRequest`, payload, {
            headers: getAuthHeaders(),
        }
        );
        return response.data;
    } catch (error) {
        console.error('Error while generating the Email: ', error);
        throw error;
    }
}

export const SendLeaveToGmail = async (emailContent: string) => {
    try {
        const response = await axios.post(`${API_END_POINT}/sendEmail`, emailContent, {
            headers: getAuthHeaders(),
        }
        );
        return response.data;
    } catch (error) {
        console.error('Error while sending Leave Request to mail: ', error);
        throw error;
    }
}

export const ApplyLeave = async (payload: ILeave) => {
    try {
        const response = await axios.post(`${API_END_POINT}/applyLeave`, payload, {
            headers: getAuthHeaders(),
        }
        );
        return response.data;
    } catch (error) {
        console.error('Error while applying Leave: ', error);
        throw error;
    }
}

export const GetLeaveRequests = async () => {
    try {
        const response = await axios.get(`${API_END_POINT}/getLeave`, {
            headers: getAuthHeaders(),
        }
        );
        return response.data;
    } catch (error) {
        console.error('Error while getting the leave requests: ', error);
        throw error;
    }
}
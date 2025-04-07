import axios from "axios"
import { API_END_POINT } from "../utils/constants";
import { TimeLog } from "../types/ITimelog";
import Cookies from "js-cookie";

const getAuthHeaders = () => {
  const token = Cookies.get('ms_intern_jwt');
  return {
    "Authorization": `Bearer ${token}`,
    "Content-Type": "application/json",
  };
};


export const AddTimelog = async (timelog: TimeLog) => {
  try {
    const res = await axios.post(`${API_END_POINT}/addTimelog`, timelog, {
      headers: getAuthHeaders(),
    })
    return res.data
  } catch (error) {
    console.error('Error while Adding time log:', error);
    throw error;
  }
}

export const GetTimelogs = async (date: string, userId: string) => {
  try {
    const res = await axios.get(`${API_END_POINT}/getTimelog`, {
      params: { date, userId },
      headers: getAuthHeaders(),
    });
    return res.data;
  } catch (error) {
    console.error('Error while fetching time logs:', error);
    throw error;
  }
}

export const UpdateTimelog = async (id: string, timelog: TimeLog) => {
  try {
    const res = await axios.put(`${API_END_POINT}/updateTimelog/${id}`, timelog, {
      headers: getAuthHeaders(),
    });
    return res.data;
  } catch (error) {
    console.error('Error while updating time log:', error);
    throw error;
  }
};

export const DeleteTimelog = async (id: string) => {
  try {
    const res = await axios.delete(`${API_END_POINT}/deleteTimelog/${id}`, {
      headers: getAuthHeaders(),
    });
    return res.data;
  } catch (error) {
    console.error('Error while Deleting time log:', error);
    throw error;
  }
}

export const SendTimelogToSheet = async (messageText: any) => {
  try {
    const response = await axios.post(`${API_END_POINT}/sendTimelogToSheet`, { messageText }, {
      headers: getAuthHeaders(),
    }
    );
    return response.data;
  } catch (error) {
    console.error('Error while sending time log to sheet:', error);
    throw error;
  }
}

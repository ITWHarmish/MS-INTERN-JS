import axios from "axios"
import { API_END_POINT } from "../utils/constants";
import { TimeLog } from "../types/ITimelog";

export const AddTimelog = async (timelog: TimeLog)=> {
  try {
    const res = await axios.post(`${API_END_POINT}/addTimelog`, timelog, { withCredentials: true })
    return res.data
  } catch (error) {
    console.error('Error Adding time log:', error);
    throw error;
  }
}

export const GetTimelogs = async ()=> {
  try {
    const res = await axios.get(`${API_END_POINT}/getTimelog`, { withCredentials: true });
    return res.data;
  } catch (error) {
    console.error('Error fetching time logs:', error);
    throw error;
  }
}

export const UpdateTimelog = async (id: string, timelog: TimeLog) => {
  try {
    const res = await axios.put(`${API_END_POINT}/updateTimelog/${id}`, timelog, { withCredentials: true });
    return res.data;
  } catch (error) {
    console.error('Error updating time log:', error);
    throw error;
  }
};

export const DeleteTimelog = async (id: string) => {
  try {
    const res = await axios.delete(`${API_END_POINT}/deleteTimelog/${id}`, { withCredentials: true });
    return res.data;
  } catch (error) {
    console.error('Error updating time log:', error);
    throw error;
  }
}


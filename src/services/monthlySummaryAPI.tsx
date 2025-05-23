import Cookies from "js-cookie";
import axios from "axios";
import { API_END_POINT } from "../utils/constants";
import { IMonthlySummary } from "../types/IMonthlySummary";

const getAuthHeaders = () => {
  const token = Cookies.get("ms_intern_jwt");
  return {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  };
};

export const GetMonthlySummary = async (payload: IMonthlySummary) => {
  try {
    const response = await axios.post(
      `${API_END_POINT}/monthlySummary`,
      payload,
      {
        headers: getAuthHeaders(),
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error while applying Leave: ", error);
    throw error;
  }
};

export const GetFullAttendanceSummary = async (payload) => {
  const { userId } = payload;
  try {
    const response = await axios.get(
      `${API_END_POINT}/getFullAttendanceSummary`,
      {
        params: userId ? { userId } : {},
        headers: getAuthHeaders(),
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error while applying Leave: ", error);
    throw error;
  }
};

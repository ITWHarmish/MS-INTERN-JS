import axios from "axios";
import { API_END_POINT } from "../utils/constants";
import Cookies from "js-cookie";

const getAuthHeaders = () => {
  const token = Cookies.get("ms_intern_jwt");
  return {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  };
};

export const GetMentorList = async () => {
  try {
    const res = await axios.get(`${API_END_POINT}/getMentorList`, {
      headers: getAuthHeaders(),
    });
    return res.data;
  } catch (error) {
    console.error("Error While Fetching Mentor List:", error);
    throw error;
  }
};

export const GetInternsByMentorId = async (mentorId: string) => {
  try {
    const res = await axios.get(`${API_END_POINT}/getInterns/${mentorId}`, {
      headers: getAuthHeaders(),
    });
    return res.data;
  } catch (error) {
    console.error("Error While Fetching Intern List:", error);
    throw error;
  }
};

export const GetInternReport = async (internId: string) => {
  try {
    const res = await axios.get(
      `${API_END_POINT}/getInternReport/${internId}`,
      {
        headers: getAuthHeaders(),
      }
    );
    return res.data;
  } catch (error) {
    console.error("Error While Fetching Intern Report List:", error);
    throw error;
  }
};

export const GetSpaceId = async () => {
  try {
    const res = await axios.get(`${API_END_POINT}/getSpaces`, {
      headers: getAuthHeaders(),
    });
    return res.data;
  } catch (error) {
    console.error("Error While Fetching Space Id and Name:", error);
    throw error;
  }
};

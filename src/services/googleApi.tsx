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

export const VerifyRevokedToken = async () => {
  try {
    await axios.put(`${API_END_POINT}/verifyRevoked-token`, {}, { headers: getAuthHeaders() });
  } catch (error) {
    console.error("Error verifying token:", error.response?.data || error);
  }
};

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
};

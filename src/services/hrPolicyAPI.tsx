import axios from "axios";
import { message } from "antd";
import { API_END_POINT } from "../utils/constants";
import Cookies from "js-cookie";

const getAuthHeaders = () => {
  const token = Cookies.get('ms_intern_jwt');
  return {
    "Authorization": `Bearer ${token}`,
    "Content-Type": "application/json",
  };
};


export const GetPolicies = async () => {
  try {
    const res = await axios.get(`${API_END_POINT}/policy`, {
      headers: getAuthHeaders(),
    })
    return res.data;
  } catch (error) {
    message.error(error.response?.data?.message || "Failed to fetch policies");
    return [];
  }
};

export const CreatePolicy = async (payload) => {
  try {
    const res = await axios.post(`${API_END_POINT}/Addpolicy`, payload, {
      headers: getAuthHeaders(),
    });
    return res.data;
  } catch (error) {
    message.error(error.response?.data?.message || "Failed to save policy");
    return null;
  }
};

export const UpdatePolicy = async (id, payload) => {
  try {
    const res = await axios.put(`${API_END_POINT}/policy/${id}`, payload, {
      headers: getAuthHeaders(),
    });
    return res.data;
  } catch (error) {
    message.error(error.response?.data?.message || "Failed to update policy");
    return false;
  }
};

export const DeletePolicy = async (id) => {
  try {
    const res = await axios.delete(`${API_END_POINT}/policy/${id}`, {
      headers: getAuthHeaders(),
    });
    return res.data;
  } catch (error) {
    console.log(error)
    message.error(error.response?.data?.message || "Failed to delete policy");
    return false;
  }
};

export const UpdatePoliciesOrder = async (payload) => {
  try {
    const res = await axios.put(`${API_END_POINT}/updateOrderOfPolicy`, payload, {
      headers: getAuthHeaders(),
    });
    return res.data;
  } catch (error) {
    message.error(error.response?.data?.message || "Failed to update policy");
    return false;
  }
};
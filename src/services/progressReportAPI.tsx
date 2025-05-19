import axios from "axios";
import Cookies from "js-cookie";
import { API_END_POINT } from "../utils/constants";
import { IProgressReport } from "../types/IReport";

const getAuthHeaders = () => {
  const token = Cookies.get("ms_intern_jwt");
  return {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  };
};

export const AddUserReportDetails = async (payload: IProgressReport) => {
  try {
    const response = await axios.post(
      `${API_END_POINT}/progressReport`,
      payload,
      {
        headers: getAuthHeaders(),
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error while Adding the user details: ", error);
    throw error;
  }
};

export const AddTaskToProgressReport = async (payload: IProgressReport) => {
  try {
    const response = await axios.put(
      `${API_END_POINT}/progressReport/tasks`,
      payload,
      {
        headers: getAuthHeaders(),
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error while Adding the tasks: ", error);
    throw error;
  }
};

export const GetProgressReport = async (id: string) => {
  try {
    const response = await axios.get(`${API_END_POINT}/progressReport/${id}`, {
      headers: getAuthHeaders(),
    });
    return response.data;
  } catch (error) {
    console.error("Error while getting the progress report: ", error);
    throw error;
  }
};

export const GetAllProgressReport = async () => {
  try {
    const response = await axios.get(`${API_END_POINT}/allProgressReport`, {
      headers: getAuthHeaders(),
    });
    return response.data;
  } catch (error) {
    console.error("Error while getting All progress report: ", error);
    throw error;
  }
};

export const UpdateTaskToProgressReport = async (
  taskId: string,
  payload: IProgressReport
) => {
  try {
    const response = await axios.put(
      `${API_END_POINT}/progressReport/tasks/${taskId}`,
      payload,
      {
        headers: getAuthHeaders(),
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error while updating the tasks: ", error);
    throw error;
  }
};

export const DeleteTaskToProgressReport = async (
  taskId: string,
  reportId: string
) => {
  try {
    const response = await axios.delete(
      `${API_END_POINT}/progressReport/tasks/${taskId}`,
      {
        headers: getAuthHeaders(),
        params: { reportId },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error while Deleting the tasks: ", error);
    throw error;
  }
};

export const DeleteProgressReport = async (reportId: string) => {
  try {
    const response = await axios.delete(
      `${API_END_POINT}/progressReport/${reportId}`,
      {
        headers: getAuthHeaders(),
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error while Deleting the Progress Report: ", error);
    throw error;
  }
};

export const UpdateUserDetailsProgressReport = async (
  reportId: string,
  payload: IProgressReport
) => {
  try {
    const response = await axios.put(
      `${API_END_POINT}/updateProgressReport/${reportId}`,
      payload,
      {
        headers: getAuthHeaders(),
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error while Updating the user Progress report: ", error);
    throw error;
  }
};

export const AddSelfEvaluation = async (
  reportId: string,
  payload: IProgressReport
) => {
  try {
    const response = await axios.put(
      `${API_END_POINT}/progressReport/selfEvaluation/${reportId}`,
      payload,
      {
        headers: getAuthHeaders(),
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error while Adding the Self Evaluation: ", error);
    throw error;
  }
};

export const UpdateProgressReportStatus = async (
  reportId: string,
  payload: IProgressReport
) => {
  try {
    const response = await axios.put(
      `${API_END_POINT}/progressReport/status/${reportId}`,
      payload,
      {
        headers: getAuthHeaders(),
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error while Updating the Status: ", error);
    throw error;
  }
};

export const GetRegularity = async (reportId: string) => {
  try {
    const response = await axios.get(
      `${API_END_POINT}/progressReport/regularity/${reportId}`,
      {
        headers: getAuthHeaders(),
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error while Fetching the regularity: ", error);
    throw error;
  }
};

export const GetPunctuality = async (reportId: string) => {
  try {
    const response = await axios.get(
      `${API_END_POINT}/progressReport/punctuality/${reportId}`,
      {
        headers: getAuthHeaders(),
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error while Fetching the punctuality: ", error);
    throw error;
  }
};

export const GetRemark = async (remarkPayload) => {
  try {
    const response = await axios.post(
      `${API_END_POINT}/progressReport/remark`,
      remarkPayload,
      {
        headers: getAuthHeaders(),
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error while Fetching the regularity: ", error);
    throw error;
  }
};

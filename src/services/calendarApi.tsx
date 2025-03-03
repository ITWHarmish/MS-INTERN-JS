import axios from "axios";
import Cookies from "js-cookie";
const getAuthHeaders = () => {
    const token = Cookies.get("ms_intern_jwt");
    return {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    };
  };
  

export const OfficeHoliday = async () => {
    try {
        const response = await axios.get(`https://toshal-ms-app-api.toshalinfotech.com/api/holiday?year=2025`, {
            headers: getAuthHeaders(),
        });
        return response.data;
    } catch (error) {
        console.log(error);
    }
}
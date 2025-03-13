import axios from "axios";
const baseURL = import.meta.env.VITE_BASE_URL;

const api = axios.create({
    baseURL: baseURL,
    headers: {
      "Content-Type": "application/json",
    },
  });
  
  export const get = async (url, params) => {
    try {
      const response = await api.get(url, { params });
      return response.data;
    } catch (error) {
      console.error("GET request error:", error);
      throw error;
    }
  };
  
import axios from "axios";
const baseURL = import.meta.env.VITE_BASE_URL;

const instance = axios.create({
  baseURL: baseURL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

export default instance;
  